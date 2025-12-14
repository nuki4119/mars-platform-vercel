// app/api/widgets/crv-tracker/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { computeUserCRV } from '../../../../utils/crv/computeUserCRV';
import { recordActivity } from '../../../../utils/crv/recordActivity';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const totalCRV = await computeUserCRV(userId);
    return NextResponse.json({ userId, totalCRV });
  } catch (error) {
    console.error('❌ CRV Tracker Error:', error);
    return NextResponse.json({ error: 'Failed to compute CRV' }, { status: 500 }); // ✅ Ensure JSON response
  }
}


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, post_id, activity_type, signal, impact = 1 } = body;

  if (!user_id || !post_id || !signal || !activity_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const result = await recordActivity({ user_id, post_id, signal, impact, activity_type });
  return result.success
    ? NextResponse.json({ status: 'ok', ...result })
    : NextResponse.json({ error: result.error }, { status: 500 });
}
