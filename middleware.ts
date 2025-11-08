import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const lang = req.cookies.get('lang')?.value || 'zh';
  res.headers.set('x-lang', lang);
  return res;
}




