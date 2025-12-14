// functions/mirror-handler/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const MARS_AI_USER_ID = '00000000-0000-0000-0000-000000000999'; // AI system user
  const { post_id } = await req.json();

  const { data: post, error } = await supabase
    .from('buzz_posts')
    .select('user_id')
    .eq('id', post_id)
    .single();

  if (error || !post) {
    return new Response(JSON.stringify({ error: 'Post not found.' }), { status: 404 });
  }

  if (post.user_id === MARS_AI_USER_ID) {
    return new Response(JSON.stringify({ error: 'AI cannot mirror its own post.' }), {
      status: 400,
    });
  }

  const result = await supabase.from('ledger_entries').insert([
    {
      type: 'DEBIT',
      user_id: MARS_AI_USER_ID,
      amount: 110,
      description: 'AI Mirror Boost',
      ref_post_id: post_id,
    },
    {
      type: 'CREDIT',
      user_id: post.user_id,
      amount: 200,
      description: 'Post Author Earned from AI Mirror Boost',
      ref_post_id: post_id,
    },
  ]);

  if (result.error) {
    return new Response(JSON.stringify({ error: result.error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
