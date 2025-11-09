export const runtime = 'edge';

export async function POST() {
  try {
    const body = JSON.stringify({ ok: true });
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const body = JSON.stringify({ ok: false, error: error?.message || 'Unknown error' });
    return new Response(body, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}




