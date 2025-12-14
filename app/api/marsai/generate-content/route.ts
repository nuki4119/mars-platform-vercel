// ✅ /app/api/marsai/generate-content/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are Mars AI, a helpful assistant for content creators.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const result = response.choices?.[0]?.message?.content || 'Mars AI has no response at this time.';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Mars AI error:', error);

    return NextResponse.json(
      { error: 'Mars AI failed to respond.', details: error.message || error },
      { status: 500 }
    );
  }
}
