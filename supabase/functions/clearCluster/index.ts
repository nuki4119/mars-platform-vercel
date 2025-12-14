import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { clusterId } = await req.json()

  if (!clusterId) {
    return new Response(JSON.stringify({ error: 'Missing clusterId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data: cluster, error: clusterError } = await supabase
    .from('clusters')
    .select('*')
    .eq('id', clusterId)
    .single()

  if (clusterError || !cluster) {
    return new Response(JSON.stringify({ error: 'Cluster not found' }), { status: 404 })
  }

  if (cluster.exit_paid) {
    return new Response(JSON.stringify({ message: 'Cluster already paid' }), { status: 200 })
  }

  // Pay out $200 to the centerUserId
  const userId = cluster.center_user_id

  // Update user wallet (+200)
  await supabase.rpc('credit_wallet', { user_id: userId, amount: 200 })

  // Add Ledger entries
  const ledgerEntries = [
    {
      user_id: userId,
      amount: 200,
      type: 'credit',
      source: 'cluster_payout',
      cluster_id: clusterId,
    },
    {
      user_id: 'company_op_account',
      amount: 110,
      type: 'debit',
      source: 'cluster_clearing',
      cluster_id: clusterId,
    },
    {
      user_id: 'company_op_account',
      amount: 50,
      type: 'credit',
      source: 'mirror_revenue',
      cluster_id: clusterId,
    },
    {
      user_id: 'clearing_account',
      amount: 40,
      type: 'credit',
      source: 'clearing_reserve',
      cluster_id: clusterId,
    },
  ]

  for (const entry of ledgerEntries) {
    await supabase.from('ledger').insert([{ ...entry }])
  }

  // Mark cluster as exit_paid = true
  await supabase.from('clusters').update({ exit_paid: true }).eq('id', clusterId)

  return new Response(JSON.stringify({ message: '✅ Cluster payout complete.' }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
