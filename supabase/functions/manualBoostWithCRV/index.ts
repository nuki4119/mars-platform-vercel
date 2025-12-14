// supabase/functions/manualBoostWithCRV/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  try {
    const body = await req.json();
    const { user_id, post_id, crv_value, payment_id } = body;

    if (!user_id || !post_id || !crv_value || !payment_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Log the boost in boost_transactions
    const { error: boostError } = await supabase.from("boost_transactions").insert([
      {
        user_id,
        post_id,
        crv_value,
        payment_reference: payment_id,
        source: "manual",
      },
    ]);

    if (boostError) {
      console.error("❌ Error inserting boost transaction:", boostError);
      return new Response(JSON.stringify({ error: "Failed to record boost" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optionally queue this post for processing
    await supabase.from("boost_queue").insert([{ post_id, user_id, crv_value }]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("❌ Unexpected error:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
