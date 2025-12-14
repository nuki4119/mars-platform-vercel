// ✅ File: /supabase/functions/closeCluster/index.ts
// Description: Finalizes a full cluster, pays the exit reward, and spawns new clusters

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async () => {
  const db = createClient(
    Deno.env.get('PUBLIC_SUPABASE_URL')!,
    Deno.env.get('PUBLIC_SUPABASE_ANON_KEY')!
  );

  // 1. Fetch the next cluster ready to split
  const { data: clusters, error: clusterErr } = await db
    .from('clusters')
    .select('*')
    .eq('status', 'ready_to_split')
    .limit(1);

  if (clusterErr || !clusters?.length) {
    return new Response(JSON.stringify({ message: '❌ No ready cluster found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404
    });
  }

  const cluster = clusters[0];

  // 2. Validate exactly 3 members
  const { data: members, error: memberErr } = await db
    .from('cluster_members')
    .select('*')
    .eq('cluster_id', cluster.id);

  if (memberErr || !members || members.length !== 3) {
    return new Response(JSON.stringify({ error: '❌ Invalid cluster member count' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }

  const centerId = cluster.center_user_id;
  const newClusters = [];

  // 3. Create 2 new clusters
  for (let i = 0; i < 2; i++) {
    const { data: inserted, error: insertErr } = await db
      .from('clusters')
      .insert({
        status: 'open',
        is_full: false,
        level: (cluster.level || 1) + 1,
        created_from: cluster.id
      })
      .select('*')
      .single();

    if (insertErr || !inserted) {
      return new Response(JSON.stringify({ error: '❌ Failed to create sub-cluster' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }
    newClusters.push(inserted);
  }

  // 4. Assign the boosters to center positions in new clusters
  const boosters = members.filter((m) => m.user_id !== centerId);

  await Promise.all([
    db.from('clusters').update({ center_user_id: boosters[0].user_id }).eq('id', newClusters[0].id),
    db.from('clusters').update({ center_user_id: boosters[1].user_id }).eq('id', newClusters[1].id),
  ]);

  // 5. Credit the exiting center user with $200
  await db.from('ledger_entries').insert({
    id: crypto.randomUUID(),
    user_id: centerId,
    amount: 200,
    type: 'credit',
    source: 'cluster_exit',
    cluster_id: cluster.id,
    created_at: new Date().toISOString()
  });

  // 6. Internal fund movement (Mirror, Clearing, etc.)
  const { data: accounts } = await db.from('ledger_accounts').select('id, name');
  const mirrorId = accounts.find((a) => a.name === 'Mirror Account')?.id;
  const clearingId = accounts.find((a) => a.name === 'Clearing Account')?.id;

  if (mirrorId && clearingId) {
    await db.from('fund_movement').insert([
      { id: crypto.randomUUID(), from_account: null, to_account: mirrorId, amount: 110, reason: 'Split A', created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), from_account: null, to_account: mirrorId, amount: 50, reason: 'Split B', created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), from_account: null, to_account: clearingId, amount: 40, reason: 'Clearing', created_at: new Date().toISOString() }
    ]);
  }

  // 7. Mark cluster closed
  await db.from('clusters').update({
    status: 'closed',
    exit_paid: true,
    exited_at: new Date().toISOString()
  }).eq('id', cluster.id);

  return new Response(JSON.stringify({
    message: `✅ Cluster ${cluster.id} closed and split`,
    next_clusters: newClusters.map((c) => c.id)
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});
