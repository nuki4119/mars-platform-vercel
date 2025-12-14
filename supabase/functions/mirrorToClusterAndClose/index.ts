// /supabase/functions/mirrorPostWithLedger/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('PUBLIC_SUPABASE_URL')!,
    Deno.env.get('PUBLIC_SUPABASE_ANON_KEY')!
  );

  const { cluster_id, post_id } = await req.json();

  if (!cluster_id || !post_id) {
    return new Response(JSON.stringify({ error: 'Missing cluster_id or post_id' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  const MIRROR_ID = 'mars-ai-agent';

  // 1. Add mirror to cluster_members
  await supabase.from('cluster_members').insert({
    user_id: MIRROR_ID,
    cluster_id,
    role: 'mirror',
    joined_at: new Date().toISOString()
  });

  // 2. Log boost
  await supabase.from('boost_logs').insert({
    user_id: MIRROR_ID,
    post_id,
    cluster_id,
    amount: 0,
    method: 'mirror',
    created_at: new Date().toISOString()
  });

  // 3. Count members in this cluster
  const { data: members, error: countErr } = await supabase
    .from('cluster_members')
    .select('id')
    .eq('cluster_id', cluster_id);

  if (countErr || !members) {
    return new Response(JSON.stringify({ error: 'Failed to count cluster members' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  if (members.length === 3) {
    // Cluster is now full — trigger closeCluster
    const closeResponse = await supabase.functions.invoke('closeCluster', {
      body: { cluster_id },
    });

    const result = await closeResponse.json();

    return new Response(
      JSON.stringify({ message: 'Mirror joined and cluster closed', result }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  }

  return new Response(JSON.stringify({ message: 'Mirror joined. Cluster not yet full.' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
