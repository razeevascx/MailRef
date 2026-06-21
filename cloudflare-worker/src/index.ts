export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string; // Set via 'wrangler secret put'
}

export default {
  async email(message: any, env: Env, ctx: any): Promise<void> {
    const toAddress = message.to; // e.g., "alias123@mailref.com"
    const fromAddress = message.from; // e.g., "sender@example.com"

    // Parse the email prefix
    const prefix = toAddress.split('@')[0].split('+')[0].toLowerCase();

    // 1. Check if the destination address is a reply mapping or normal alias forward
    if (prefix.startsWith('reply-')) {
      await handleAnonymizedReply(message, prefix, env);
      return;
    }

    // 2. Standard Inbound Forwarding Route
    const queryUrl = `${env.SUPABASE_URL}/rest/v1/aliases?select=id,is_active,profiles(primary_email)&prefix=eq.${prefix}`;

    const dbResponse = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!dbResponse.ok) {
      console.error(`DB Query failed: ${await dbResponse.text()}`);
      message.setReject("MailRef configuration database query error.");
      return;
    }

    const aliases = await dbResponse.json() as any[];
    if (aliases.length === 0) {
      message.setReject(`MailRef alias '${prefix}' does not exist.`);
      return;
    }

    const alias = aliases[0];
    const destination = alias.profiles?.primary_email;

    if (!alias.is_active || !destination) {
      await logDelivery(alias.id, fromAddress, message.headers.get("subject"), "bounced", message.rawSize, env);
      message.setReject("This private email alias has been deactivated.");
      return;
    }

    // 3. Check Blocked Senders List
    const blockQueryUrl = `${env.SUPABASE_URL}/rest/v1/blocked_senders?select=id&alias_id=eq.${alias.id}&sender_email=eq.${encodeURIComponent(fromAddress)}`;
    const blockResponse = await fetch(blockQueryUrl, {
      method: 'GET',
      headers: {
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (blockResponse.ok) {
      const blocks = await blockResponse.json() as any[];
      if (blocks.length > 0) {
        // Increment Block Counter and log
        await logDelivery(alias.id, fromAddress, message.headers.get("subject"), "blocked", message.rawSize, env);
        await updateStats(alias.id, 'emails_blocked', env);
        // Silently discard to prevent spammer feedback
        return;
      }
    }

    // 4. Update Stats & Log Forwarding
    await updateStats(alias.id, 'emails_forwarded', env);
    await logDelivery(alias.id, fromAddress, message.headers.get("subject"), "forwarded", message.rawSize, env);

    // 5. Forward raw email to user primary address
    await message.forward(destination);
  }
};

// Helper to log delivery activity to Supabase
async function logDelivery(aliasId: string, sender: string, subject: string | null, status: string, size: number, env: Env) {
  const logUrl = `${env.SUPABASE_URL}/rest/v1/forwarding_logs`;
  await fetch(logUrl, {
    method: 'POST',
    headers: {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      alias_id: aliasId,
      sender_email: sender,
      subject: subject || '(No Subject)',
      status: status,
      size_bytes: size
    })
  });
}

// Helper to increment stats (emails_forwarded or emails_blocked)
async function updateStats(aliasId: string, field: 'emails_forwarded' | 'emails_blocked', env: Env) {
  const updateUrl = `${env.SUPABASE_URL}/rest/v1/aliases?id=eq.${aliasId}`;

  // Call RPC or fetch alias to increment in PostgREST
  const getUrl = `${env.SUPABASE_URL}/rest/v1/aliases?select=${field}&id=eq.${aliasId}`;
  const response = await fetch(getUrl, {
    headers: {
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  if (response.ok) {
    const data = await response.json() as any[];
    if (data.length > 0) {
      const current = data[0][field] || 0;
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: current + 1 })
      });
    }
  }
}

// Handler for forwarding replies from the user back to the sender anonymized
async function handleAnonymizedReply(message: any, replyPrefix: string, env: Env) {
  // Parsing flow: extract reply target mapping
  // If reply prefix is 'reply-hash', resolve the hash mapping in DB to find target address.
  // Then use Resend API to deliver the email back to the original sender, setting From as the alias.
}
