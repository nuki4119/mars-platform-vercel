// ✅ /app/api/marsai/feed-suggestion/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // Safe fake post as a fallback
  return NextResponse.json({
    title: '🚀 Mars AI Insight',
    content: 'Explore the future of content creation and monetization on Mars Platform.',
    media_url: '',
    username: 'marsai',
    avatar_url: '',
    crv_value: 0,
    boost_count: 0,
    share_count: 0,
    category_symbol: 'AI',
  });
}
