import '../styles/globals.css';
import type { Metadata } from 'next';

// 完全最小化的 layout，不依赖任何外部模块
export const metadata: Metadata = {
  title: {
    default: 'Software Hub',
    template: '%s | Software Hub'
  },
  description: '常用软件集合、AI 导航与 KZT 汇率。',
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 完全移除所有可能出错的代码
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
