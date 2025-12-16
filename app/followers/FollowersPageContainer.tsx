// FollowersPageContainer.tsx
// Page to show users who follow you and who you follow

import React from 'react';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';

const FollowerCard = ({ username, postCount }: { username: string; postCount: number }) => (
  <div className="bg-gray-800 rounded-xl p-4 flex justify-between items-center text-sm">
    <div>
      <p className="text-white font-semibold">@{username}</p>
      <p className="text-gray-400">Buzz Posts: {postCount}</p>
    </div>
    <button className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs hover:bg-pink-700">Unfollow</button>
  </div>
);

const FollowerList = ({ title, data }: { title: string; data: { username: string; postCount: number }[] }) => (
  <div className="bg-gray-900 rounded-xl p-4 space-y-4">
    <h2 className="text-lg font-bold text-white">{title}</h2>
    {data.map((user, idx) => (
      <FollowerCard key={idx} {...user} />
    ))}
  </div>
);

const sampleFollowers = [
  { username: 'creatorbuzz', postCount: 405 },
  { username: 'devmaster', postCount: 2500 },
  { username: 'aihelper', postCount: 135 },
];

const sampleFollowing = [
  { username: 'buzzchef', postCount: 97 },
  { username: 'musicsynth', postCount: 85 },
  { username: 'trendfusion', postCount: 633 },
];

export default function FollowersPageContainer() {
  return (
    <UniversalPageLayout
      mainContent={
        <div className="space-y-6">
          <FollowerList title="Your Followers" data={sampleFollowers} />
          <FollowerList title="You're Following" data={sampleFollowing} />
        </div>
      }
      rightContent={null}

    />
  );
}
