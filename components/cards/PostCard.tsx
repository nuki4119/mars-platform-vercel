'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Share2, Rocket, Repeat } from 'lucide-react';

export default function PostCard({ post }) {
  const router = useRouter();

  const {
    id,
    title = 'Untitled',
    content = '',
    media_url = '',
    boost_count = 0,
    share_count = 0,
    username = 'anonymous',
    avatar_url = '',
    category_symbol = 'GEN',
  } = post || {};

  const goToPost = () => {
    router.push(`/expandedpostview/${id}`);
  };

  return (
    <div className="w-full min-w-[320px] bg-black border border-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden text-white">
      {/* User Row */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          {avatar_url ? (
            <Image
              src={avatar_url}
              alt={username}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-neutral-700 rounded-full" />
          )}
          <span className="text-sm font-medium text-gray-300">@{username}</span>
        </div>
      </div>

      {/* Media */}
      {media_url && (
        <div className="w-full overflow-hidden rounded-xl mt-4">
          <img
            src={media_url}
            alt={title}
            className="w-full h-auto max-h-96 object-contain mx-auto cursor-pointer rounded-xl"
            onClick={goToPost}
          />
        </div>
      )}

      {/* Title + Content */}
      <div className="px-4 pt-4 space-y-2">
        <h3
          className="text-lg font-semibold text-white hover:text-[#D9272E] cursor-pointer"
          onClick={goToPost}
        >
          {title}
        </h3>

        {content && (
          <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden">
            {content}
          </p>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap justify-between items-center px-4 py-3 mt-3 text-sm text-gray-400 border-t border-neutral-800 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Rocket size={16} className="text-[#D9272E]" />
            {boost_count}
          </span>
          <span className="flex items-center gap-1">
            <Repeat size={16} className="text-[#D9272E]" />
            {share_count}
          </span>
          <Link
            href={`/category/${category_symbol}`}
            className="text-xs bg-neutral-800 text-white px-2 py-1 rounded-full font-mono hover:bg-[#D9272E]"
          >
            #{category_symbol}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="text-gray-400 hover:text-[#D9272E]"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied!');
              }
            }}
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={goToPost}
            className="text-sm text-white bg-[#D9272E] hover:bg-red-800 px-4 py-1.5 rounded-lg font-medium shadow"
          >
            🚀 Boost
          </button>
        </div>
      </div>
    </div>
  );
}

