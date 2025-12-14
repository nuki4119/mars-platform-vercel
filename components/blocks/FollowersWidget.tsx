// components/blocks/FollowersWidget.tsx

import React from "react";
import MarsCard from "../ui/MarsCard";

const sampleFollowers = [
  { name: "Zara Sparks", handle: "@zara" },
  { name: "Kai Flux", handle: "@kaiflux" },
  { name: "Nova Blue", handle: "@nova" },
];

export default function FollowersWidget() {
  return (
    <MarsCard>
      <h2 className="text-white font-bold text-base mb-3">Followers</h2>
      <ul className="space-y-2 text-sm">
        {sampleFollowers.map((follower, i) => (
          <li key={i} className="text-slate-300 flex justify-between">
            <span>{follower.name}</span>
            <span className="text-marsRed">{follower.handle}</span>
          </li>
        ))}
      </ul>
    </MarsCard>
  );
}
