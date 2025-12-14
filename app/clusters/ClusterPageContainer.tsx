'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import ClusterPostCard from '../../components/blocks/ClusterPostCard';

export default function ClusterPageContainer() {
  const [clusters, setClusters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchClusters = async () => {
      const { data, error } = await supabase
        .from('clusters')
        .select(`
          id, post_id, owner, username, crv_value, boost_count, symbol,
          buzz_posts:post_id (
            id, title, media_url, username, crv_value, boost_count, category_symbol
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clusters:', error.message);
      } else {
        console.log('Clusters fetched:', data);
        setClusters(data);
      }
    };

    fetchClusters();
  }, []);

  const filteredClusters = clusters.filter((cluster) => {
    const post = cluster.buzz_posts;
    if (!post) return false;

    const matchesTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? post.category_symbol?.toLowerCase() === category.toLowerCase() : true;

    return matchesTitle && matchesCategory;
  });

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Open Clusters</h1>

      {/* Search & Filter Inputs */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="bg-slate-800 text-white px-4 py-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by category..."
          className="bg-slate-800 text-white px-4 py-2 rounded w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* 🔥 Render Clusters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredClusters.map((cluster) => {
          const post = cluster.buzz_posts;
          if (!post) return null;

          return <ClusterPostCard key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
}

