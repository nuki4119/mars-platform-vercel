'use client';

import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import CategoryBoostTrendsChart from '../../components/blocks/CategoryBoostTrendsChart';
import CategoryTable from '../../components/blocks/CategoryTable';
import TopBuzzPostsWidget from '../../components/blocks/TopBuzzPostsWidget';
import FollowerBuzzSummary from '../../components/blocks/FollowerBuzzSummary';

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
        <TopBuzzPosts />
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <FollowerBuzzSummary />
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
