// 🔁 Force rebuild - clean cache test

'use client';

import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import CategoryBoostTrendsChart from '../../components/blocks/CategoryBoostTrendsChart';
import CategoryTable from '../../components/blocks/CategoryTable';
import TopBuzzPostsWidget from '../../components/blocks/TopBuzzPostsWidget';
import FollowersWidget from '../../components/blocks/FollowersWidget';




export default function CategoryPage() {
  const mainContent = (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Mars AI Engine</h1>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
        <CategoryBoostTrendsChart />
      </div>
      <CategoryTable />
    </div>
  );

  const rightContent = (
  <div className="space-y-4">
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <TopBuzzPostsWidget />
    </div>
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <FollowersWidget />
    </div>
  </div>
);


  return (
    <UniversalPageLayout
      mainContent={mainContent}
      rightContent={rightContent}
    />
  );
}
