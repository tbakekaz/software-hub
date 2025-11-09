// 完全裸测试页面，不导入任何模块，不使用任何 className
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function BareTestPage() {
  return (
    <html>
      <head>
        <title>裸测试页面</title>
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', margin: 0 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅ 裸测试页面</h1>
        <p style={{ marginBottom: '0.5rem' }}>如果你能看到这个页面，说明 Edge Runtime 基本功能正常。</p>
        <p style={{ marginBottom: '0.5rem' }}>时间: {new Date().toISOString()}</p>
        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ 这个页面完全不导入任何模块，不使用任何 className。</p>
      </body>
    </html>
  );
}

