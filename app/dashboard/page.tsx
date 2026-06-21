import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/get-started')
  }

  const userEmail = data.claims.email || ''

  // Fetch initial aliases
  const { data: aliases } = await supabase
    .from('aliases')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch initial forwarding logs
  const { data: logs } = await supabase
    .from('forwarding_logs')
    .select(`
      *,
      aliases (
        prefix,
        domain
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <Dashboard 
      initialAliases={(aliases as any[]) || []} 
      initialLogs={(logs as any[]) || []} 
      userEmail={userEmail} 
    />
  )
}
