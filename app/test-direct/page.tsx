// 完全独立的测试页面，不经过任何 layout
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function DirectTestPage() {
  return (
    <html>
      <head>
        <title>直接测试页面</title>
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', margin: 0 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅ 直接测试页面</h1>
        <p style={{ marginBottom: '0.5rem' }}>这个页面在 app 目录下，不经过 (site) layout。</p>
        <p style={{ marginBottom: '0.5rem' }}>时间: {new Date().toISOString()}</p>
        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ 如果看到这个，说明 Edge Runtime 工作正常！</p>
      </body>
    </html>
  );
}

