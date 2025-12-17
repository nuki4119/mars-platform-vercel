// app/checkout/CheckoutPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) {
      setError("Missing post ID");
      setLoading(false);
      return;
    }

    const initiateCheckout = async () => {
      try {
        const res = await fetch("/api/createBoostCheckout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: postId }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Unknown error");

        window.location.href = data.checkout_url;
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    initiateCheckout();
  }, [postId]);

  if (loading) return <p className="text-white p-8">⏳ Preparing your checkout...</p>;
  if (error) return <p className="text-red-500 p-8">❌ {error}</p>;

  return null;
}
