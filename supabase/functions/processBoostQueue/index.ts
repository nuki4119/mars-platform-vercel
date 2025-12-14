// supabase/functions/processBoostQueue/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: boostQueue, error } = await supabase
    .from('boost_queue')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch boost_queue:', error.message);
    return new Response('Error fetching queue', { status: 500 });
  }

  for (const boost of boostQueue) {
    const { post_id, booster_id } = boost;

    // Create a new cluster entry (or add to cluster logic)
    const { error: clusterError } = await supabase.rpc('assign_to_cluster', {
      post_id,
      booster_id,
    });

    if (clusterError) {
      console.error('Error assigning to cluster:', clusterError.message);
      continue;
    }

    // Remove processed item
    await supabase
      .from('boost_queue')
      .delete()
      .eq('id', boost.id);
  }

  return new Response('Processed boost queue', { status: 200 });
});
