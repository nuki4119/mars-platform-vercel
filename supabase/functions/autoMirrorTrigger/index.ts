// /supabase/functions/autoMirrorTrigger/index.ts
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

  // ✅ Fetch member count
  const { count, error } = await supabase
    .from('cluster_members')
    .select('*', { count: 'exact', head: true })
    .eq('cluster_id', cluster_id);

  if (error || typeof count !== 'number') {
    return new Response(JSON.stringify({ error: 'Failed to count cluster members' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  if (count === 3) {
    const result = await supabase.functions.invoke('mirrorHandler', {
      body: { cluster_id, post_id }
    });

    const resultData = await result.json();

    return new Response(JSON.stringify({
      message: '🔁 Cluster full — mirrorHandler triggered.',
      mirrorResult: resultData
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({
    message: 'Cluster not full yet.',
    count
  }), { headers: { 'Content-Type': 'application/json' } });
});
