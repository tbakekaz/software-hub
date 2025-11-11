import { NextResponse } from 'next/server';

// POST /api/convert
// body: { text: string; mode: 'a2c' | 'c2a' }
export async function POST(req: Request) {
  try {
    const { text, mode } = await req.json();
    if (typeof text !== 'string' || (mode !== 'a2c' && mode !== 'c2a')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const endpoint = process.env.KZ_CONVERT_API_URL;
    const apiKey = process.env.KZ_CONVERT_API_KEY;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'KZ_CONVERT_API_URL not configured' },
        { status: 501 }
      );
    }

    // 透传到外部转换服务（按需调整字段名）
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({ text, mode }),
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        return NextResponse.json({ error: msg || 'Upstream error' }, { status: 502 });
      }
      const data = await res.json();
      // 期待 { result: string }
      if (!data || typeof data.result !== 'string') {
        return NextResponse.json({ error: 'Bad upstream payload' }, { status: 502 });
      }
      return NextResponse.json({ result: data.result });
    } catch (err: any) {
      clearTimeout(timeout);
      const message =
        err?.name === 'AbortError' ? 'Upstream timeout' : err?.message || 'Upstream fetch error';
      return NextResponse.json({ error: message }, { status: 504 });
    }
  } catch {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}


