// components/blocks/SmartCTA.tsx

import React from "react";
import MarsCard from "../ui/MarsCard";

export default function SmartCTA() {
  return (
    <MarsCard>
      <h2 className="text-white font-bold text-base mb-2">
        Mars AI Suggested Post Area
      </h2>
      <div className="bg-slate-800 text-slate-300 p-3 rounded-md text-center text-sm shadow-inner">
        Notifications or Prompts
        <br />
        Alerts or AI tips.
      </div>
    </MarsCard>
  );
}
