// 静态页面，移除 edge runtime 以启用静态生成
// export const runtime = 'edge';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold">关于</h1>
      <p className="text-muted-foreground">个人项目：常用软件集合与 AI 导航。</p>
    </main>
  );
}




