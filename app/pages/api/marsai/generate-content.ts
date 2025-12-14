// /pages/api/marsai/generate-content.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Write a short blog post draft for: ${prompt}` }],
      temperature: 0.8,
    });

    const content = completion.choices?.[0]?.message?.content || '';
    return NextResponse.json({ content });
  } catch (err) {
    console.error('[Mars AI Error]', err);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}

