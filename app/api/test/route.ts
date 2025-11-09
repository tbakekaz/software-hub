// 最简单的测试 API，不导入任何外部模块
export const runtime = 'edge';

export async function GET() {
  // 直接返回 Response，不使用 Response.json，避免可能的动态 import
  const body = JSON.stringify({
    success: true,
    timestamp: new Date().toISOString(),
    runtime: 'edge',
    message: '✅ 基本 API 功能正常'
  });
  
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

