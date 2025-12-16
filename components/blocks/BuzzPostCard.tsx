'use client';

import React from 'react';
import Image from 'next/image';
import { Zap, Rocket, MoreHorizontal } from 'lucide-react';

interface BuzzPost {
  id: string;
  title: string;
  media_url?: string;
  youtube_link?: string;
  username: string;
  avatar_url?: string;
  crv_value: number;
  boost_count: number;
  category_symbol?: string;
}

interface Props {
  post: BuzzPost;
  onBoost?: () => void;
  onFollow?: () => void;
  onMenu?: () => void;
}

export default function BuzzPostCard({ post, onBoost, onFollow, onMenu }: Props) {
  const youTubeId = post.youtube_link?.split('v=')[1];
  const youTubeThumbnail = youTubeId
    ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
    : '';

  const imageUrl = youTubeThumbnail || post.media_url;

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* MEDIA */}
      {imageUrl && (
        <div className="w-full h-48 bg-gray-100">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4">
        {/* TITLE */}
        <h2 className="text-gray-900 text-base font-semibold mb-2 leading-tight line-clamp-2">
          {post.title}
        </h2>

        {/* ROW 1: CATEGORY • CRV • BOOSTS */}
        <div className="flex items-center text-xs text-gray-500 gap-4 mb-3">
          {post.category_symbol && (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono text-[11px]">
              #{post.category_symbol}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-500" />
            {post.crv_value}
          </span>
          <span className="flex items-center gap-1">
            <Rocket size={12} className="text-pink-500" />
            {post.boost_count}
          </span>
        </div>

        {/* ROW 2: USERNAME • ACTIONS */}
        <div className="flex items-center justify-between">
          {/* Avatar + Username */}
          <div className="flex items-center gap-3">
            {post.avatar_url ? (
              <Image
                src={post.avatar_url}
                alt={post.username}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 bg-gray-200 rounded-full" />
            )}
            <span className="text-sm text-gray-800 font-medium">{post.username}</span>
          </div>

          {/* Actions: Follow, Boost, Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onFollow}
              className="text-blue-600 text-xs font-semibold hover:underline"
            >
              Follow
            </button>
            <button
              onClick={onBoost}
              className="text-red-600 text-xs font-semibold border border-red-500 px-2 py-0.5 rounded hover:bg-red-50"
            >
              Boost
            </button>
            <button onClick={onMenu} className="text-gray-500 hover:text-black">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
