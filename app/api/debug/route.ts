// 诊断 API，用于捕获运行时错误
// 注意：完全移除所有可能触发动态 import 的模块
export const runtime = 'edge';

// 只导入 content-edge，不导入 cookies 或 i18n（它们可能触发动态 import）
import { getAllSoftware } from '@/lib/content-edge';

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
        // 暂时移除 cookies 和 i18n 测试，因为它们可能触发动态 import
        i18n: 'skipped (may trigger async_hooks)',
        cookies: 'skipped (may trigger async_hooks)',
      }
    };

    // 只测试 content-edge（不依赖 cookies）
    try {
      const software = getAllSoftware();
      tests.tests.contentEdge = `success (${software.length} items)`;
    } catch (error: any) {
      tests.tests.contentEdge = `error: ${error.message}`;
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

