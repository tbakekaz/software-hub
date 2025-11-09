// 简单的测试页面，用于诊断 500 错误
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">✅ 测试页面</h1>
      <p className="text-muted-foreground mb-4">
        如果你能看到这个页面，说明基本的 Edge Runtime 功能正常。
      </p>
      <div className="space-y-2">
        <p><strong>运行时：</strong>Edge Runtime</p>
        <p><strong>时间：</strong>{new Date().toISOString()}</p>
        <p><strong>状态：</strong>✅ 正常运行</p>
      </div>
    </main>
  );
}

