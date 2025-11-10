// 诊断 API，用于捕获运行时错误
// Vercel 支持所有功能，可以正常测试
export const runtime = 'edge';

import { getAllSoftware } from '@/lib/content-edge';
import { getCurrentLang } from '@/lib/i18n/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const tests = {
      timestamp: new Date().toISOString(),
      runtime: 'edge',
      nodeVersion: typeof process !== 'undefined' ? process.version : 'N/A',
      tests: {
        basic: 'success',
        contentEdge: 'not tested',
        i18n: 'not tested',
        cookies: 'not tested',
      }
    };

    try {
      const software = await getAllSoftware();
      tests.tests.contentEdge = `success (${software.length} items)`;
    } catch (error: any) {
      tests.tests.contentEdge = `error: ${error.message}`;
    }

    try {
      const lang = await getCurrentLang();
      tests.tests.i18n = `success (${lang})`;
    } catch (error: any) {
      tests.tests.i18n = `error: ${error.message}`;
    }

    try {
      const cookieStore = await cookies();
      tests.tests.cookies = 'success';
    } catch (error: any) {
      tests.tests.cookies = `error: ${error.message}`;
    }

    const body = JSON.stringify(tests);
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const body = JSON.stringify({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return new Response(body, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

