import { getSoftware } from '@/lib/content-edge';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = getSoftware(slug);
    
    if (!data) {
      return NextResponse.json({ error: 'Software not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API] Error fetching software:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

