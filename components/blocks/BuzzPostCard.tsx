'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../supabase/client';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import Image from 'next/image';
import { Zap, Rocket, Repeat } from 'lucide-react';
import CRVTrackerExpanded from '../../components/blocks/CRVTrackerExpanded';

interface BuzzPost {
  id: string;
  title: string;
  content?: string;
  media_url?: string;
  youtube_link?: string;
  username: string;
  avatar_url?: string;
  crv_value: number;
  boost_count: number;
  share_count?: number;
  external_link?: string;
  category_symbol?: string;
  user_id: string;
  aiSuggested?: boolean;
}

export default function PostPageContainer() {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<BuzzPost | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('buzz_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('❌ Error fetching post:', error);
      } else {
        setPost(data);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <p className="text-gray-400 p-4">Loading post...</p>;
  }

  const youTubeId = post.youtube_link?.split('v=')[1];
  const youTubeThumbnail = youTubeId ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg` : '';

  const mainContent = (
    <div className={`w-full max-w-5xl mx-auto bg-[#161B22] border border-[#30363d] rounded-2xl shadow transition p-4 ${post.aiSuggested ? 'border-red-500' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {post.avatar_url ? (
            <Image
              src={post.avatar_url}
              alt={post.username}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 bg-slate-800 rounded-full" />
          )}
          <span className="text-sm text-white font-medium">@{post.username}</span>
          <button className="text-pink-400 text-sm ml-2">💖 Follow</button>
        </div>
        <button
          className="text-slate-400 hover:text-white"
          title="Share this post"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: post.title,
                text: `Check out this post: ${post.title}`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('🔗 Link copied to clipboard!');
            }
          }}
        >
          <Repeat size={18} />
        </button>
      </div>

      {/* Media Preview */}
      {(youTubeThumbnail || post.media_url) && (
        <div className="w-full max-h-[500px] overflow-hidden rounded-md cursor-pointer mb-4">
          <img
            src={youTubeThumbnail || post.media_url!}
            alt={post.title}
            className="w-full h-auto object-contain mx-auto"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-white font-semibold text-2xl mb-2">
        {post.title}
      </h1>

      {/* Category */}
      {post.category_symbol && (
        <span className="inline-block bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-mono mb-4">
          #{post.category_symbol}
        </span>
      )}

      {/* Description */}
      <div className="text-gray-300 whitespace-pre-line mb-4">
        <h2 className="font-semibold text-white mb-1">About this item</h2>
        <p>{post.content}</p>
      </div>

      {/* External Link */}
      {post.external_link && (
        <a
          href={post.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-4"
        >
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-slate-100 transition">
            Visit Offer
          </button>
        </a>
      )}

      {/* Metrics */}
      <div className="border-t border-gray-800 pt-4 text-sm text-gray-400 flex flex-wrap gap-4 items-center mb-4">
        <span className="flex items-center gap-1">
          <Zap size={14} className="text-yellow-400" /> CRV: {post.crv_value}
        </span>
        <span className="flex items-center gap-1">
          <Rocket size={14} className="text-pink-400" /> Boosts: {post.boost_count}
        </span>
        <span className="flex items-center gap-1">
          <Repeat size={14} className="text-cyan-400" /> Shared: {post.share_count || 0}
        </span>
      </div>

      {/* CRV Widget */}
      <CRVTrackerExpanded userId={post.user_id} />

      {/* Boost Button */}
      <button className="w-full bg-marsRed hover:bg-marsRedDark text-white mt-4 py-2 rounded-xl text-sm font-semibold">
        🚀 Boost This Post
      </button>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} sidebarContent={null} />;
}