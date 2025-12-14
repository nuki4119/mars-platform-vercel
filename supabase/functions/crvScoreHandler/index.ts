// ✅ CRV Trigger & Scoring Pipeline (Core Logic)
// Edge Function: /supabase/functions/crvScoreHandler/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization')! } },
  });

  const { activity_type, post_id, user_id, impact = 1, signal } = await req.json();
  const timestamp = new Date().toISOString();

  if (!post_id || !user_id || !signal || !activity_type) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  // 1. Store Activity Log (used for historical tracking)
  await supabase.from('ai_activity_log').insert({
    post_id,
    user_id,
    signal,
    impact,
    activity_type,
    created_at: timestamp,
  });

  // 2. Update CRV score in crv_post_scores
  const { data: existing } = await supabase
    .from('crv_post_scores')
    .select('*')
    .eq('post_id', post_id)
    .single();

  const column = `score_${signal}`;
  const update = existing
    ? { [column]: (existing[column] || 0) + impact }
    : { post_id, [column]: impact };

  const upsertRes = await supabase.from('crv_post_scores').upsert(update);

  if (upsertRes.error) {
    console.error('❌ CRV upsert error', upsertRes.error);
    return new Response('Error updating CRV', { status: 500 });
  }

  return new Response(JSON.stringify({ status: 'ok', post_id }), { status: 200 });
});
