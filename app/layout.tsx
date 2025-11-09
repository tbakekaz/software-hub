import '../styles/globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getCurrentLang } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'zh_CN',
    type: 'website'
  }
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 添加错误处理，确保 layout 始终可以渲染
  let lang: string = 'zh';
  try {
    lang = await getCurrentLang();
  } catch (error) {
    // 如果获取语言失败，使用默认值
  }
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
