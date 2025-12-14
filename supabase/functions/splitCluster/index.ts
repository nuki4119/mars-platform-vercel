// supabase/functions/splitCluster/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('PUBLIC_SUPABASE_URL')!,
    Deno.env.get('PUBLIC_SUPABASE_ANON_KEY')!
  )

  const { data: clusters, error } = await supabase
    .from('clusters')
    .select('*')
    .eq('is_full', false)
    .limit(1)

  if (error || !clusters?.length) {
    return new Response(JSON.stringify({ message: 'No available cluster found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    })
  }

  const cluster = clusters[0]

  const { data: members, error: memberError } = await supabase
    .from('cluster_members')
    .select('*')
    .eq('cluster_id', cluster.id)

  if (memberError || !members) {
    return new Response(JSON.stringify({ error: 'Failed to fetch cluster members' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  if (members.length >= 10) {
    const { error: updateError } = await supabase
      .from('clusters')
      .update({ is_full: true })
      .eq('id', cluster.id)

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to mark cluster as full' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Proceed to distribute funds and rewards
    // (This can be offloaded to another Edge Function if needed)

    return new Response(JSON.stringify({ message: 'Cluster is now full and ready to split' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  return new Response(JSON.stringify({ message: 'Cluster not ready yet', count: members.length }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
