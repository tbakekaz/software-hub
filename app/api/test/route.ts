// 最简单的测试 API，不导入任何外部模块
export const runtime = 'edge';

export async function GET() {
  try {
    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      runtime: 'edge',
      message: '✅ 基本 API 功能正常'
    }, { status: 200 });
  } catch (error: any) {
    return Response.json({
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

