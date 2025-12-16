'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { Loader } from 'lucide-react';
import PostCard from '../../components/cards/PostCard';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import TopBuzzPostsWidget from '../../components/blocks/TopBuzzPostsWidget';
import FollowersWidget from '../../components/blocks/FollowersWidget';

export default function FeedPageContainer() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('buzz_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // 👉 Right sidebar widgets
  const rightSidebar = (
    <div className="space-y-6">
      <FollowersWidget />
      <TopBuzzPostsWidget />
    </div>
  );

  // 👉 Main feed content
  const feedContent = (
    <>
      {loading && (
        <div className="text-center py-10">
          <Loader className="animate-spin inline-block mr-2" />
          Loading posts...
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No posts yet. Be the first to post!
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );

  return (
    <UniversalPageLayout
      mainContent={feedContent}
      rightContent={rightSidebar}
    />
  );
}
