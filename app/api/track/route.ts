import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[Track] Error:', error);
    return NextResponse.json({ ok: false, error: error?.message || 'Unknown error' }, { status: 500 });
  }
}




