// components/blocks/TopBuzzPostsWidget.tsx

import React from "react";
import { supabase } from '../../supabase/client';


const sampleBuzzPosts = [
  { title: "Ninja | Air Fryer | 6.5 QT Pro XL", count: 222 },
  { title: "CRAFTSMAN Socket Set", count: 160 },
  { title: "3D Chalk Art", count: 456 },
  { title: "Codex Front-end Coding", count: 780 },
  { title: "Everyday Genius Vol I", count: 1700 },
];

export default function TopBuzzPostsWidget() {
  return (
    <div className="bg-slate-850 border border-slate-700 rounded-2xl p-4 shadow-inner-slate">
      <h2 className="text-white font-bold text-base mb-3">Top 100 Buzz Posts</h2>
      <ul className="space-y-2">
        {sampleBuzzPosts.map((post, index) => (
          <li
            key={index}
            className="text-slate-300 flex justify-between items-center text-sm"
          >
            <span className="truncate max-w-[70%]">{post.title}</span>
            <span className="text-marsRed font-semibold">{post.count}</span>
          </li>
        ))}
      </ul>
      <button className="w-full mt-4 text-xs bg-slate-800 hover:bg-marsRed text-white py-2 px-3 rounded-xl transition duration-300 shadow hover:shadow-mars">
        See More
      </button>
    </div>
  );
}
