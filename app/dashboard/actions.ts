'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const adjectives = [
  'swift', 'silent', 'golden', 'frosty', 'shadow', 'crypto', 
  'cosmic', 'brave', 'nimble', 'indigo', 'stellar', 'ancient', 
  'mighty', 'rapid', 'lunar', 'vivid', 'solar', 'hidden', 'arctic'
];

const nouns = [
  'panda', 'falcon', 'rabbit', 'badger', 'coyote', 'phoenix', 
  'matrix', 'beacon', 'nebula', 'glider', 'vortex', 'crater', 
  'anchor', 'comet', 'safari', 'canyon', 'forest', 'ranger', 'cipher'
];

// Helper to generate a random readable prefix
function generateRandomPrefix(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 3-digit number
  return `${adj}-${noun}-${num}`;
}

export async function getAliases() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('aliases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching aliases:', error);
    return [];
  }

  return data || [];
}

export async function createAlias(description?: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Attempt to generate a unique prefix
  let prefix = generateRandomPrefix();
  let unique = false;
  let attempts = 0;

  while (!unique && attempts < 5) {
    const { data, error } = await supabase
      .from('aliases')
      .select('id')
      .eq('prefix', prefix)
      .maybeSingle();

    if (!error && !data) {
      unique = true;
    } else {
      prefix = generateRandomPrefix();
      attempts++;
    }
  }

  const { data, error } = await supabase
    .from('aliases')
    .insert({
      user_id: user.id,
      prefix,
      domain: 'mailref.com',
      description: description || '',
      is_active: true,
      emails_forwarded: 0,
      emails_blocked: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating alias:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true, data };
}

export async function toggleAliasStatus(aliasId: string, isActive: boolean) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('aliases')
    .update({ is_active: isActive })
    .eq('id', aliasId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error toggling alias:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateAliasDescription(aliasId: string, description: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('aliases')
    .update({ description })
    .eq('id', aliasId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating description:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteAlias(aliasId: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('aliases')
    .delete()
    .eq('id', aliasId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting alias:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function getBlockedSenders(aliasId: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Ensure the alias belongs to the user
  const { data: alias, error: aliasError } = await supabase
    .from('aliases')
    .select('id')
    .eq('id', aliasId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (aliasError || !alias) {
    throw new Error('Unauthorized or alias not found');
  }

  const { data, error } = await supabase
    .from('blocked_senders')
    .select('*')
    .eq('alias_id', aliasId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blocked senders:', error);
    return [];
  }

  return data || [];
}

export async function blockSender(aliasId: string, senderEmail: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Ensure user owns alias
  const { data: alias, error: aliasError } = await supabase
    .from('aliases')
    .select('id')
    .eq('id', aliasId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (aliasError || !alias) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('blocked_senders')
    .insert({
      alias_id: aliasId,
      sender_email: senderEmail.toLowerCase().trim()
    });

  if (error) {
    console.error('Error blocking sender:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function unblockSender(aliasId: string, senderEmail: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Ensure user owns alias
  const { data: alias, error: aliasError } = await supabase
    .from('aliases')
    .select('id')
    .eq('id', aliasId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (aliasError || !alias) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('blocked_senders')
    .delete()
    .eq('alias_id', aliasId)
    .eq('sender_email', senderEmail.toLowerCase().trim());

  if (error) {
    console.error('Error unblocking sender:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function getForwardingLogs() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Fetch logs via joining on user aliases
  const { data, error } = await supabase
    .from('forwarding_logs')
    .select(`
      *,
      aliases!inner(
        prefix,
        domain,
        user_id
      )
    `)
    .eq('aliases.user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data || [];
}

export async function updateProfileEmail(newEmail: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      primary_email: newEmail, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile email:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
