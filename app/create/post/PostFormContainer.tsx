// app/create/post/PostFormContainer.tsx

import React from 'react';
import UniversalPageLayout from '../../feed/UniversalPageLayout';
import PostForm from '@/components/forms/PostForm';

export default function PostFormContainer() {
  return (
    <UniversalPageLayout
      mainContent={<PostForm />}
      sidebarContent={null}
    />
  );
}
