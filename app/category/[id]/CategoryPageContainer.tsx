'use client';

import React from 'react';
import CategoryBoostTrendsChart from '../../../components/blocks/CategoryBoostTrendsChart';
import CategoryTable from '../../../components/blocks/CategoryTable';

export default function CategoryPageContainer() {
  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Mars AI Engine</h1>

      {/* Chart block */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6">
        <CategoryBoostTrendsChart />
      </div>

      {/* Category table */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <CategoryTable />
      </div>
    </div>
  );
}

