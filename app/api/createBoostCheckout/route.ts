// app/api/createBoostCheckout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { post_id } = await req.json();

    if (!post_id) {
      return NextResponse.json(
        { error: "Missing post_id" },
        { status: 400 }
      );
    }

    // 🔐 TODO: Replace with real Stripe checkout session creation
    console.log("Simulating Stripe checkout for post:", post_id);

    // ✅ Mock successful checkout redirect
    return NextResponse.json({ checkout_url: "/checkout/success" });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error. Could not start checkout." },
      { status: 500 }
    );
  }
}
