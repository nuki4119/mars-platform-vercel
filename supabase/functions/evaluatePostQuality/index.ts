import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { post_id } = await req.json();
  if (!post_id) {
    return new Response(JSON.stringify({ error: "Missing post_id" }), { status: 400 });
  }

  const { data: post, error: postError } = await supabase
    .from("buzz_posts")
    .select("id, content")
    .eq("id", post_id)
    .single();

  if (postError || !post) {
    return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
  }

  // Request AI scoring from OpenAI
  const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a content quality evaluator. Score the text on a scale from 1 to 10 based on originality, clarity, and engagement.",
        },
        {
          role: "user",
          content: post.content,
        },
      ],
    }),
  });

  const aiJson = await openAiRes.json();
  const aiReply = aiJson.choices?.[0]?.message?.content || "5";
  const score = parseFloat(aiReply.match(/\d+/)?.[0] || "5");

  // Store the score in ai_boost_scores
  const { error: insertError } = await supabase.from("ai_boost_scores").upsert({
    post_id,
    score,
    evaluated_at: new Date().toISOString(),
  });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, score }), { status: 200 });
});
