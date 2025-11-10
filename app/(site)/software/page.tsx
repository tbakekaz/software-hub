import { getInitialSoftwarePage, softwareManifest } from '@/lib/content-edge';
import ClientList from './ClientList';
import { getDictionary } from '@/lib/i18n/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = {
  title: `软件列表 - ${siteConfig.name}`,
  description: '浏览所有可用软件，包括 Adobe 系列、办公软件等常用工具',
  openGraph: {
    title: `软件列表 - ${siteConfig.name}`,
    description: '浏览所有可用软件，包括 Adobe 系列、办公软件等常用工具',
    url: `${siteConfig.url}/software`,
  },
};

export default async function SoftwarePage() {
  try {
    const { dict, lang } = await getDictionary();
    const initialItems = await getInitialSoftwarePage();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{dict.software.listTitle}</h1>
        {/* 客户端搜索与展示 */}
        <ClientList initialItems={initialItems} manifest={softwareManifest} dict={dict} lang={lang} />
      </main>
    );
  } catch (error: any) {
    console.error('[SoftwarePage] Error:', error);
    const fallback = await getDictionary();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{fallback.dict.software.listTitle}</h1>
        <p className="text-muted-foreground">暂无软件</p>
      </main>
    );
  }
}

