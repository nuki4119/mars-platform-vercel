import { supabase } from '../../supabase/client';

export async function recordActivity({
  user_id,
  post_id,
  signal,
  impact,
  activity_type,
}: {
  user_id: string;
  post_id: string;
  signal: string;
  impact: number;
  activity_type: string;
}) {
  const timestamp = new Date().toISOString();

  const { error: logError } = await supabase.from('ai_activity_log').insert({
    user_id,
    post_id,
    signal,
    impact,
    activity_type,
    created_at: timestamp,
  });

  if (logError) {
    console.error('❌ Activity log insert failed:', logError);
    return { success: false, error: logError.message };
  }

  const { data: existing } = await supabase
    .from('crv_post_scores')
    .select('*')
    .eq('post_id', post_id)
    .single();

  const column = `score_${signal}`;
  const update = existing
    ? { [column]: (existing[column] || 0) + impact }
    : { post_id, [column]: impact };

  const { error: upsertError } = await supabase.from('crv_post_scores').upsert(update);

  if (upsertError) {
    console.error('❌ Upsert failed:', upsertError);
    return { success: false, error: upsertError.message };
  }

  return { success: true };
}
