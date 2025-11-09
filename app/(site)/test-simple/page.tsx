// 最简单的测试页面，不依赖任何外部组件
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function SimpleTestPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">✅ 最简单的测试</h1>
      <p className="mb-2">如果你能看到这个页面，说明 Edge Runtime 基本功能正常。</p>
      <p className="text-sm text-muted-foreground">时间: {new Date().toISOString()}</p>
    </main>
  );
}

