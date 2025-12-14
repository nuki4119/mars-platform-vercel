'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import Link from 'next/link';
import MarsCard from '../ui/MarsCard';

type BoostedPost = {
  id: string;
  title: string;
  boost_count: number;
};

export default function TopBoostedPostsWidget() {
  const [topPosts, setTopPosts] = useState<BoostedPost[]>([]);

  useEffect(() => {
    const fetchTopBoostedPosts = async () => {
      const { data, error } = await supabase
        .from('buzz_posts')
        .select('id, title, boost_count')
        .eq('is_active', true)
        .order('boost_count', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching boosted posts:', error);
      } else {
        setTopPosts(data);
      }
    };

    fetchTopBoostedPosts();
  }, []);

  return (
    <MarsCard>
      <h2 className="text-white font-bold text-base mb-3">🔥 Top Boosted Posts</h2>
      <ul className="space-y-2 text-sm">
        {topPosts.length > 0 ? (
          topPosts.map((post) => (
            <li key={post.id} className="flex justify-between text-slate-300">
              <Link href={`/expandedpostview/${post.id}`} className="hover:underline truncate max-w-[70%]">
                {post.title}
              </Link>
              <span className="text-marsRed font-semibold">{post.boost_count}</span>
            </li>
          ))
        ) : (
          <li className="text-slate-500">No boosted posts yet.</li>
        )}
      </ul>
    </MarsCard>
  );
}
