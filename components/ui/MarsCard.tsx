// components/ui/MarsCard.tsx

import React from "react";

export default function MarsCard({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-850 border border-slate-700 rounded-2xl p-4 shadow-inner-slate ${className}`}
    >
      {children}
    </div>
  );
}
