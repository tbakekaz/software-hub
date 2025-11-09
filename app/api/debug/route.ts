// 诊断 API，用于捕获运行时错误
// 注意：完全移除动态 import，避免触发 async_hooks 导入
// 使用静态 import 在文件顶部
export const runtime = 'edge';

// 使用静态 import，避免动态 import 触发 async_hooks
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
        // 测试 content-edge
        contentEdge: 'pending',
        // 测试 i18n
        i18n: 'pending',
        // 测试 cookies
        cookies: 'pending',
      }
    };

    // 测试 content-edge（使用静态导入）
    try {
      const software = getAllSoftware();
      tests.tests.contentEdge = `success (${software.length} items)`;
    } catch (error: any) {
      tests.tests.contentEdge = `error: ${error.message}`;
    }

    // 测试 i18n（使用静态导入）
    try {
      const lang = await getCurrentLang();
      tests.tests.i18n = `success (${lang})`;
    } catch (error: any) {
      tests.tests.i18n = `error: ${error.message}`;
    }

    // 测试 cookies
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

