// Supabase Edge Function (Deno-compatible)
// File: index.ts for Edge Function "autoBoostForUser"

import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';

serve(async (req, context) => {
  const { userId } = await req.json();
  const now = new Date();
  const hour = now.getHours();

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
  }

  // Only allow boosting between 9AM–5PM
  if (hour < 9 || hour >= 17) {
    return new Response(JSON.stringify({ error: 'Outside boosting hours' }), { status: 403 });
  }

  // 1. Get up to 5 eligible buzz posts for this user
  const { data: posts, error } = await context.supabase
    .from('buzz_posts')
    .select('id, crv_value')
    .eq('owner_id', userId)
    .lt('crv_total_paid', 1000)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !posts || posts.length === 0) {
    return new Response(JSON.stringify({ success: false, message: 'No eligible posts' }), { status: 200 });
  }

  let successCount = 0;

  for (const post of posts) {
    const boostRes = await context.invoke('manualBoost', {
      userId,
      postId: post.id,
      boostChainId: crypto.randomUUID(),
    });

    if (boostRes?.status === 200) {
      successCount++;

      // Log AI activity
      await context.supabase.from('ai_activity_logs').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        task: 'autoBoost',
        post_id: post.id,
        created_at: new Date().toISOString()
      });
    }
  }

  return new Response(
    JSON.stringify({ success: true, message: `${successCount} posts auto-boosted for user ${userId}` }),
    { status: 200 }
  );
});