'use client';

import React from 'react';
import UniversalPageLayout from '../../components/Layout/UniversalPageLayout';

export default function AssistantPageContainer() {
  const mainContent = (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Mars AI Assistant</h1>
      <p className="text-slate-400">
        Mars AI will help you write, analyze, and optimize your content. This assistant is powered by GPT and supports a range of tasks such as boosting tips, CRV strategy insights, and more.
      </p>

      <div className="bg-slate-800 rounded-xl p-6 shadow border border-slate-700">
        <p className="text-slate-300 italic">🤖 Assistant UI goes here…</p>
      </div>
    </div>
  );

  return <UniversalPageLayout mainContent={mainContent} />;
}
