// 诊断 API，用于捕获运行时错误
// 注意：逐步测试，先测试基本功能，再测试模块导入
export const runtime = 'edge';

export async function GET() {
  try {
    // 第一步：测试基本功能（不导入任何模块）
    const tests = {
      timestamp: new Date().toISOString(),
      runtime: 'edge',
      nodeVersion: typeof process !== 'undefined' ? process.version : 'N/A',
      tests: {
        basic: 'success',
        // 暂时不测试模块导入，先确保基本功能正常
        contentEdge: 'not tested',
        i18n: 'not tested',
        cookies: 'not tested',
      }
    };

    // 第二步：尝试导入模块（如果基本功能正常）
    try {
      // 使用静态 import，但在 try-catch 中
      const { getAllSoftware } = await import('@/lib/content-edge');
      const software = getAllSoftware();
      tests.tests.contentEdge = `success (${software.length} items)`;
    } catch (error: any) {
      tests.tests.contentEdge = `error: ${error.message}`;
    }

    try {
      const { getCurrentLang } = await import('@/lib/i18n/server');
      const lang = await getCurrentLang();
      tests.tests.i18n = `success (${lang})`;
    } catch (error: any) {
      tests.tests.i18n = `error: ${error.message}`;
    }

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

