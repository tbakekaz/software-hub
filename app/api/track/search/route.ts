export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.info('[track:search]', {
      query: payload?.query,
      type: payload?.type,
      at: new Date().toISOString(),
      ua: request.headers.get('user-agent') || 'unknown',
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, message: error?.message || 'failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
