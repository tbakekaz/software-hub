import { getSoftware } from '@/lib/content-edge';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await getSoftware(slug);
    
    if (!data) {
      const body = JSON.stringify({ error: 'Software not found' });
      return new Response(body, {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = JSON.stringify(data);
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const body = JSON.stringify({
      error: 'Internal server error',
      message: error?.message || 'Unknown error'
    });
    return new Response(body, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

