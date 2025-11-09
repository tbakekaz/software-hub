// 临时移除 CSS 导入，测试是否是 CSS 导致的问题
// import '../styles/globals.css';
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
  // 完全移除所有可能出错的代码，包括 CSS 和 className
  return (
    <html lang="zh" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
