import React, { useState } from "react";
import MarsCard from "../ui/MarsCard";

const tiers = [
  { level: 1, required: 5 },
  { level: 2, required: 25 },
  { level: 3, required: 125 },
  { level: 4, required: 625 },
  { level: 5, required: 3125 },
  { level: 6, required: 15625 },
];

export default function AdGalacticTierChart({ currentBoosts = 0, compact = false, mode = "inline" }) {
  const [showHover, setShowHover] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getFillPercent = (required) => {
    if (currentBoosts >= required) return 100;
    const prevRequired = tiers.findLast(t => t.required < required)?.required || 0;
    const tierRange = required - prevRequired;
    const progressInTier = currentBoosts - prevRequired;
    return Math.max(0, Math.min(100, (progressInTier / tierRange) * 100));
  };

  const ChartBars = () => (
    <div className="space-y-2">
      {tiers.map((tier) => {
        const filled = getFillPercent(tier.required);
        return (
          <div key={tier.level} className="flex items-center gap-2">
            <span className="w-14 text-left text-white">Tier {tier.level}</span>
            <div className="flex-1 h-4 bg-slate-800 border border-slate-600 rounded overflow-hidden">
              <div
                className="h-full bg-marsRed transition-all"
                style={{ width: `${filled}%` }}
              ></div>
            </div>
            <span className="w-16 text-right text-slate-400">{tier.required.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );

  if (mode === "hover") {
    return (
      <div className="relative inline-block">
        <button
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
          className="text-xs px-2 py-1 bg-slate-700 text-white rounded-full hover:bg-marsRed transition"
        >
          View Tier
        </button>
        {showHover && (
          <div
            onMouseLeave={() => setShowHover(false)}
            className="absolute z-50 left-0 top-full mt-2 w-72 bg-slate-900 shadow-lg border border-slate-700 p-4 rounded-2xl"
          >
            <ChartBars />
          </div>
        )}
      </div>
    );
  }

  if (mode === "modal") {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs px-3 py-2 bg-marsRed text-white rounded hover:bg-marsRedDark transition"
        >
          View Boost Stats
        </button>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-slate-900 w-full max-w-lg p-6 rounded-2xl border border-slate-700 relative shadow-xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
              <h2 className="text-white text-lg font-bold mb-4 text-center">AdGalactic Tier Breakdown</h2>
              <ChartBars />
              <div className="mt-4 text-sm text-slate-400 text-center">
                Boosts: {currentBoosts.toLocaleString()} | Max Cap: 15,625
                <br />
                Mars AI Is Working For You
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default: Inline Chart Mode (wrap in MarsCard)
  return (
    <MarsCard className={`text-center w-full max-w-md mx-auto ${compact ? "text-sm" : "text-base"}`}>
      <h2 className="text-white font-semibold mb-3">AdGalactic Content Syndication</h2>
      <ChartBars />
      {!compact && (
        <p className="mt-4 text-slate-300 font-medium">Mars AI Is Working For You</p>
      )}
    </MarsCard>
  );
}

