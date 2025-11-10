// 静态页面，移除 edge runtime 以启用静态生成
// export const runtime = 'edge';

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold">隐私政策</h1>
      <p className="text-sm text-muted-foreground">此站点使用 GA4（若配置）进行匿名统计。</p>
    </main>
  );
}




