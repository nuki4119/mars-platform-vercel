'use client';
import TopBuzzPostsWidget from '../blocks/TopBuzzPostsWidget';
import FollowersWidget from '../blocks/FollowersWidget';

export default function RightSidebar() {
  return (
    <div className="space-y-6">
      <FollowersWidget />
      <TopBuzzPostsWidget />
    </div>
  );
}
