// 诊断 API，用于捕获运行时错误
export const runtime = 'edge';

export async function GET() {
  try {
    // 测试基本功能
    const tests = {
      timestamp: new Date().toISOString(),
      runtime: 'edge',
      nodeVersion: typeof process !== 'undefined' ? process.version : 'N/A',
      tests: {
        // 测试导入 content-edge
        contentEdge: 'pending',
        // 测试导入 i18n
        i18n: 'pending',
        // 测试 cookies
        cookies: 'pending',
      }
    };

    // 测试 content-edge
    try {
      const { getAllSoftware } = await import('@/lib/content-edge');
      const software = getAllSoftware();
      tests.tests.contentEdge = `success (${software.length} items)`;
    } catch (error: any) {
      tests.tests.contentEdge = `error: ${error.message}`;
    }

    // 测试 i18n
    try {
      const { getCurrentLang } = await import('@/lib/i18n/server');
      const lang = await getCurrentLang();
      tests.tests.i18n = `success (${lang})`;
    } catch (error: any) {
      tests.tests.i18n = `error: ${error.message}`;
    }

    // 测试 cookies
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      tests.tests.cookies = 'success';
    } catch (error: any) {
      tests.tests.cookies = `error: ${error.message}`;
    }

    return Response.json(tests, { status: 200 });
  } catch (error: any) {
    return Response.json({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

