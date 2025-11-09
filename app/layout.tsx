// 临时移除 CSS 和 getCurrentLang，测试是否是它们导致的问题
// import '../styles/globals.css';
import type { Metadata } from 'next';

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
  // 完全移除 getCurrentLang 调用，使用固定语言
  return (
    <html lang="zh" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
