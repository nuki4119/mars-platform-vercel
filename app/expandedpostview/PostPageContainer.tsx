'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  slug?: string;
}

export default function PostPageContainer() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<BuzzPost | null>(null);

  useEffect(() => {
  if (!postId) return;

  const fetchPost = async () => {
    const { data: postData, error: postError } = await supabase
      .from('buzz_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError) {
      console.error('❌ Error fetching post:', postError);
    } else {
      setPost(postData);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('❌ Error fetching user:', userError);
      return;
    }

    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    if (walletError) {
      console.error('Wallet error:', walletError.message);
    } else if (walletData && walletData.length > 0) {
      setWallet(walletData[0]);
    } else {
      console.warn('No wallet found for user.');
    }
  };

  fetchPost();
}, [postId]);


  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Check out this post',
        text: post?.content || '',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (!post) {
    return <p className="text-gray-400 p-4">Loading post...</p>;
  }

  const isVideo = !!post.youtube_link;
  const youTubeId = post.youtube_link?.split('v=')[1];
  const youTubeThumbnail = youTubeId ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg` : '';

  const mainContent = (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 ${
        post?.aiSuggested ? 'border border-red-500 rounded-2xl' : ''
      }`}
    >
      {/* Left: Media */}
      <div className="flex justify-center items-start">
        {youTubeThumbnail ? (
          <img
            src={youTubeThumbnail}
            alt="YouTube Thumbnail"
            className="w-full max-h-[80vh] object-contain rounded-xl"
          />
        ) : (
          <img
            src={post?.media_url || ''}
            alt={post?.title}
            className="w-full max-h-[80vh] object-contain rounded-xl"
          />
        )}
      </div>

      {/* Right: Content */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">{post?.title}</h1>

        {/* Author + Share */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {post?.avatar_url ? (
              <Image
                src={post.avatar_url}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
            )}
            <span className="text-sm text-gray-300">@{post?.username}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-slate-400 hover:text-white text-sm"
              title="Share this post"
            >
              <Repeat size={16} />
              Share
            </button>

            <button className="text-pink-400 text-sm">💖 Follow</button>
          </div>
        </div>

        {/* Content */}
        <div className="text-gray-300 whitespace-pre-line">
          <h2 className="font-semibold text-white mb-1">About this item</h2>
          <p>{post?.content}</p>
        </div>

        {post?.external_link && (
          <a
            href={post.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2"
          >
            <button className="bg-white text-black px-4 py-2 rounded hover:bg-slate-100 transition">
              Visit Offer
            </button>
          </a>
        )}

        {/* Metrics */}
        <div className="border-t border-gray-800 pt-4 text-sm text-gray-400 flex flex-wrap gap-4 items-center">
          <span className="flex items-center gap-1">
            <Zap size={14} className="text-yellow-400" /> CRV: {post?.crv_value}
          </span>
          <span className="flex items-center gap-1">
            <Rocket size={14} className="text-pink-400" /> Boosts: {post?.boost_count}
          </span>
          <span className="flex items-center gap-1">
            <Repeat size={14} className="text-cyan-400" /> Shared: {post?.share_count || 0}
          </span>
          {post?.category_symbol && (
            <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full font-mono">
              {post.category_symbol}
            </span>
          )}
        </div>

        {/* CRV Tracker */}
        <CRVTrackerExpanded userId={post?.user_id} />

        {/* Boost Button */}
        {post?.slug && (
          <button
            onClick={() => router.push(`/posts/${post.slug}/boost`)}
            className="w-full bg-marsRed hover:bg-marsRedDark text-white mt-4 py-2 rounded-xl text-sm font-semibold"
          >
            🚀 Boost This Post
          </button>
        )}
      </div>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} sidebarContent={null} />;
}