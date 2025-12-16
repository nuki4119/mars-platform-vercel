'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../supabase/client';
import BuzzPostCard from '../../components/blocks/BuzzPostCard';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import Masonry from 'react-masonry-css';

interface BuzzPost {
  id: string;
  title: string;
  content: string;
  media_url?: string;
  crv_value: number;
  boost_count: number;
  username: string;
  avatar_url?: string;
}

export default function ProfilePageContainer() {
  const params = useParams();
  const username = params?.username as string;

  const [posts, setPosts] = useState<BuzzPost[]>([]);
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      const { data, error } = await supabase
        .from('buzz_posts')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user posts:', error.message);
      } else {
        setPosts(data);
        if (data.length > 0 && data[0].avatar_url) {
          setAvatar(data[0].avatar_url);
        }
      }
    };

    if (username) fetchUserPosts();
  }, [username]);

  const mainContent = (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt={username}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-slate-700 rounded-full" />
        )}
        <h1 className="text-2xl text-white font-bold">@{username}</h1>
      </div>

      <Masonry
        breakpointCols={{
          default: 4,
          1280: 3,
          768: 2,
          480: 1,
        }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <BuzzPostCard key={post.id} post={post} />
        ))}
      </Masonry>
    </div>
  );

  return <UniversalPageLayout
  mainContent={mainContent}
  rightContent={sidebarContent} // ✅ Correct prop
/>

}
