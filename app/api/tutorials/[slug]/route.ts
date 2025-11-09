import { getTutorialBySlug } from '@/lib/content-edge';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = getTutorialBySlug(slug);
    
    if (!data) {
      return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
    }

    return NextResponse.json({ content: data.content });
  } catch (error: any) {
    console.error('[API] Error fetching tutorial:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

