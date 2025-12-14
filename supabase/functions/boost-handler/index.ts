// functions/boost-handler/index.ts
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { user_id, post_id, crv_value = 1.0, source = "manual" } = await req.json();

  if (!user_id || !post_id) {
    return new Response(JSON.stringify({ error: "Missing user_id or post_id" }), { status: 400 });
  }

  // Optional: validate post exists
  const { data: post, error: postError } = await supabase
    .from("buzz_posts")
    .select("id")
    .eq("id", post_id)
    .single();

  if (postError || !post) {
    return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
  }

  // (NO wallet check or debit here — assumed already handled)

  const { error: insertError } = await supabase.from("boost_transactions").insert({
    user_id,
    post_id,
    crv_value,
    source,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});