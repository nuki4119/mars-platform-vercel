'use client';

import UniversalPageLayout from '../../../components/Layout/UniversalPageLayout';
import CategoryPageContainer from './CategoryPageContainer';
import TopBuzzPostsWidget from '../../../components/blocks/TopBuzzPostsWidget';
import FollowersWidget from '../../../components/blocks/FollowersWidget';

export default function Page() {
  return (
    <UniversalPageLayout
      mainContent={<CategoryPageContainer />}
      rightContent={
        <div className="space-y-6">
          <TopBuzzPostsWidget />
          <FollowersWidget />
        </div>
      }
    />
  );
}
