'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import ClusterPostCard from '../../components/blocks/ClusterPostCard';

interface ClusterPost {
  id: string;
  title: string;
  media_url?: string;
  username: string;
  crv_value: number;
  boost_count: number;
  category_symbol?: string;
}

export default function ClusterPageContainer() {
  const [clusterPosts, setClusterPosts] = useState<ClusterPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClusterPosts = async () => {
      const { data, error } = await supabase
        .from('clusters')
        .select(`id, post_id, status, is_full, crv_value, boost_count, username, symbol, buzz_posts(title, media_url, category_symbol)`) 
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cluster posts:', error);
        setLoading(false);
        return;
      }

      // Map cluster data to displayable post card info
      const posts = data
        .filter((cluster: any) => cluster.buzz_posts) // Ensure related post exists
        .map((cluster: any) => ({
          id: cluster.post_id,
          title: cluster.buzz_posts.title,
          media_url: cluster.buzz_posts.media_url,
          username: cluster.username,
          crv_value: cluster.crv_value || 0,
          boost_count: cluster.boost_count || 0,
          category_symbol: cluster.buzz_posts.category_symbol || 'GEN',
        }));

      setClusterPosts(posts);
      setLoading(false);
    };

    fetchClusterPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">🚀 Open Clusters Feed</h1>

      {loading ? (
        <p className="text-slate-400">Loading clusters...</p>
      ) : clusterPosts.length === 0 ? (
        <p className="text-slate-400">No open clusters at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clusterPosts.map((post) => (
            <ClusterPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}