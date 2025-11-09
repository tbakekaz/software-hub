// 完全最小化的测试页面，不导入任何内容，不使用任何 className
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function MinimalTestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅ 最小化测试</h1>
      <p style={{ marginBottom: '0.5rem' }}>如果你能看到这个页面，说明 Edge Runtime 基本功能正常。</p>
      <p style={{ marginBottom: '0.5rem' }}>时间: {new Date().toISOString()}</p>
      <p style={{ marginBottom: '0.5rem' }}>这个页面不导入任何外部模块，不使用任何 className。</p>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✅ 如果看到这个，说明 Edge Runtime 工作正常！</p>
    </div>
  );
}

