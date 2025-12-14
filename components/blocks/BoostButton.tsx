// components/blocks/BoostButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function BoostButton({ postId }: { postId: string }) {
  const router = useRouter();

  const handleBoostClick = () => {
    // 🔒 Mars AI Platform now requires Stripe for boosts
    alert("🚀 Boosting is now powered by Stripe. You'll soon be redirected to checkout.");
    
    // TODO: Replace with real Stripe checkout call
    router.push(`/post/${postId}#boost`);
  };

  return (
    <button
      onClick={handleBoostClick}
      className="bg-marsRed text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-red-700 transition"
    >
      Boost 🚀
    </button>
  );
}
