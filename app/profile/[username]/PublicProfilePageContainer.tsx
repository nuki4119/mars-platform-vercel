'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../supabase/client';
import UniversalPageLayout from '../../../components/Layout/UniversalPageLayout';
import BuzzPostCard from '../../../components/blocks/BuzzPostCard';
import Image from 'next/image';
import { Zap, Rocket, Repeat, UserCheck } from 'lucide-react';

interface BuzzPost {
  id: string;
  title: string;
  media_url?: string;
  username: string;
  crv_value: number;
  boost_count: number;
  share_count: number;
  category_symbol?: string;
}

interface UserProfile {
  username: string;
  avatar_url?: string;
  bio?: string;
  total_crv: number;
  follower_count: number;
  post_count: number;
}

export default function PublicProfilePageContainer() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<BuzzPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchProfileData = async () => {
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('users')
        .select('username, avatar_url, bio')
        .eq('username', username)
        .single();

      // Fetch user CRV & counts
      const { data: statsData } = await supabase
        .rpc('get_user_crv_summary', { username_param: username });

      // Fetch posts
      const { data: postsData } = await supabase
        .from('buzz_posts')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: false });

      setProfile({
        ...profileData,
        total_crv: statsData?.total_crv || 0,
        follower_count: statsData?.followers || 0,
        post_count: postsData?.length || 0,
      });

      setPosts(postsData || []);
      setLoading(false);
    };

    fetchProfileData();
  }, [username]);

  const mainContent = (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={80}
            height={80}
            className="rounded-full border border-slate-600"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-700" />
        )}

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">@{profile?.username}</h1>
          <p className="text-sm text-slate-400">{profile?.bio || 'No bio yet.'}</p>

          <div className="flex items-center gap-4 text-sm text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              <Zap size={14} className="text-yellow-400" /> {profile?.total_crv.toFixed(2)} CRV
            </span>
            <span className="flex items-center gap-1">
              <Rocket size={14} className="text-pink-400" /> {profile?.post_count} Posts
            </span>
            <span className="flex items-center gap-1">
              <UserCheck size={14} className="text-blue-400" /> {profile?.follower_count} Followers
            </span>
          </div>
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BuzzPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="text-sm text-slate-400 p-4 space-y-4">
      <div>
        💡 <strong>Mars AI</strong> will analyze content trends, growth signals, and performance in the future.
      </div>
      <div className="bg-slate-800 p-3 rounded-xl">
        Coming Soon: Content Stock Predictions 📈
      </div>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} sidebarContent={sidebarContent} />;
}
