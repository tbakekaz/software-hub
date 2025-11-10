import '../styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/config/site';
import { getCurrentLang } from '@/lib/i18n/server';
import GA from '@/components/GA';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: '软件下载,AI工具,教程,软件集合,软件导航,KZT汇率',
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      zh: `${siteConfig.url}?lang=zh`,
      kk: `${siteConfig.url}?lang=kk`,
      ru: `${siteConfig.url}?lang=ru`,
      en: `${siteConfig.url}?lang=en`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let lang: string = 'zh';
  try {
    lang = await getCurrentLang();
  } catch (error) {
    // 如果获取语言失败，使用默认值
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GA />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
