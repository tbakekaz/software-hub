// 完全最小化的测试页面，不导入任何内容
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function MinimalTestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>✅ 最小化测试</h1>
      <p>如果你能看到这个页面，说明 Edge Runtime 基本功能正常。</p>
      <p>时间: {new Date().toISOString()}</p>
      <p>这个页面不导入任何外部模块。</p>
    </div>
  );
}

