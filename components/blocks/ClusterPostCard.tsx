'use client';

import React from 'react';

export type ClusterPost = {
  id: string;
  title: string;
  media_url?: string;
  username: string;
  crv_value: number;
  boost_count: number;
  category_symbol?: string;
};

type ClusterPostCardProps = {
  post: ClusterPost;
};

export default function ClusterPostCard({ post }: ClusterPostCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-white">
      <h2 className="text-lg font-bold mb-2">{post.title}</h2>

      {post.media_url && (
        <img
          src={post.media_url}
          alt={post.title}
          className="rounded-lg mb-3"
        />
      )}

      <div className="text-sm text-slate-400 mb-2">
        @{post.username}
      </div>

      <div className="flex justify-between text-sm">
        <span>CRV: {post.crv_value}</span>
        <span>Boosts: {post.boost_count}</span>
      </div>

      {post.category_symbol && (
        <div className="mt-2 text-xs text-marsRed">
          #{post.category_symbol}
        </div>
      )}
    </div>
  );
}
