'use client';

import React from 'react';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';
import AdGalacticTierChart from '../../components/blocks/AdGalacticTierChart';
import AdGalacticTierSearch from '../../components/blocks/AdGalacticTierSearch';

export default function AdGalacticPageContainer() {
  const mainContent = (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-white">AdGalactic Content Syndication</h1>

      <AdGalacticTierSearch />

      <div className="mt-6">
        <AdGalacticTierChart />
      </div>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} />;
}
