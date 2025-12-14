// Supabase Edge Function: updateAllCrvScores
import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';

const MAX_SCORE = 120; // Tune this based on realistic system ceilings

serve(async (_req, context) => {
  const { data: posts, error } = await context.supabase.from('buzz_posts').select('id');
  if (error) return new Response(JSON.stringify({ error: 'Failed to load posts' }), { status: 500 });

  for (const post of posts) {
    const postId = post.id;

    // 1. Load signals
    const boosts = await count('cluster_members', { post_id: postId });
    const externalShares = await count('external_share_log', { post_id: postId });
    const affiliateTriggers = await count('affiliate_stats', { post_id: postId });
    const aiQuality = await getSingle('ai_scores', postId) || 5;
    const engagements = await count('engagements', { post_id: postId });
    const verifiedClicks = await count('clicks', { post_id: postId, verified: true });
    const boostSpeedBonus = await calculateSpeedBonus(postId);
    const categoryBonus = await getCategoryBonus(postId);
    const clusterExits = await count('cluster_exits', { post_id: postId });
    const decayPenalty = await calculateDecay(postId);

    // 2. Apply formula
    const raw = (boosts * 2) + (externalShares * 3) + (affiliateTriggers * 1.5) + (aiQuality * 4) +
                (engagements * 1.2) + (verifiedClicks * 2) + (boostSpeedBonus * 1.5) +
                categoryBonus - (clusterExits * 2) - decayPenalty;

    const crv = Math.min(100, Math.max(1, Math.round((raw / MAX_SCORE) * 100)));

    // 3. Update post
    await context.supabase.from('buzz_posts').update({ crv_value: crv }).eq('id', postId);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});

async function count(table: string, match: Record<string, any>) {
  const { count } = await context.supabase.from(table).select('*', { count: 'exact', head: true }).match(match);
  return count || 0;
}

async function getSingle(table: string, postId: string) {
  const { data } = await context.supabase.from(table).select('score').eq('post_id', postId).single();
  return data?.score;
}

async function calculateSpeedBonus(postId: string) {
  return 3; // Placeholder: implement real speed calculation logic
}

async function getCategoryBonus(postId: string) {
  return 2; // Placeholder: determine based on category volume
}

async function calculateDecay(postId: string) {
  return 5; // Placeholder: increase over time if idle
}
