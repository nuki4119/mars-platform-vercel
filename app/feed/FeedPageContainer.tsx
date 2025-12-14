// FeedPageContainer.tsx – AI-Enhanced with Red Border on AI Posts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { Loader } from 'lucide-react';
import PostCard from '../../components/cards/PostCard';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import RightSidebar from '../../components/Layout/RightSidebar';
import TopBuzzPostsWidget from '../../components/blocks/TopBuzzPostsWidget';
import FollowersWidget from '../../components/blocks/FollowersWidget';

export default function FeedPageContainer() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsWithAI = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('buzz_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data) {
          console.error('Error fetching posts:', error);
          setPosts([]);
          return;
        }

        // Attempt to fetch AI post suggestion
        let aiPost = null;
        try {
          const aiRes = await fetch('/api/marsai/feed-suggestion');
          const contentType = aiRes.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            aiPost = await aiRes.json();
          } else {
            console.warn('AI response was not JSON, skipping AI injection.');
          }
        } catch (aiError) {
          console.error('Failed to fetch AI suggestion:', aiError);
        }

        const injected: any[] = [];
        let counter = 0;

        for (let i = 0; i < data.length; i++) {
          injected.push(data[i]);
          counter++;

          if ((counter === 5 || counter === 7) && aiPost) {
            injected.push({
              ...aiPost,
              id: `marsai-${i}`,
              created_at: new Date().toISOString(),
              aiSuggested: true,
              title: aiPost.title || '🚀 Mars AI Insight',
              content:
                aiPost.content ||
                'Discover the future of digital creation with Mars AI.',
            });
            counter = 0;
          }
        }

        setPosts(injected);
      } catch (err) {
        console.error('Failed to load feed:', err);
        setPosts([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPostsWithAI();
  }, []);

  const rightSidebar = (
    <div className="space-y-6">
      <FollowersWidget />
      <TopBuzzPostsWidget />
    </div>
  );

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
          <div
            key={post.id}
            className={post.aiSuggested ? 'border border-red-500 rounded-2xl' : ''}
          >
            <PostCard post={post} />
          </div>
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
