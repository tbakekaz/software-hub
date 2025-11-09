// 诊断 API，用于捕获运行时错误
// 注意：完全移除动态 import，只使用静态 import
export const runtime = 'edge';

// 使用静态 import（在文件顶部）
import { getAllSoftware } from '@/lib/content-edge';
import { getCurrentLang } from '@/lib/i18n/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 测试基本功能
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

    // 测试模块（使用静态导入的模块）
    try {
      const software = getAllSoftware();
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

    return Response.json(tests, { status: 200 });
  } catch (error: any) {
    return Response.json({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

