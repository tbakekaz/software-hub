import { getTutorialBySlug } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = getTutorialBySlug(slug);
  
  if (!data) {
    return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
  }

  return NextResponse.json({ content: data.content });
}

