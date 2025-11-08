import { getSoftware } from '@/lib/content';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = getSoftware(slug);
  
  if (!data) {
    return NextResponse.json({ error: 'Software not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

