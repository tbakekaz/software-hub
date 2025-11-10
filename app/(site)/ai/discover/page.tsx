import { getAllAI } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import DiscoverClient from './DiscoverClient';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = {
  title: `AI 工具发现 - ${siteConfig.name}`,
  description: '发现最新的 AI 工具，包括对话、图像、视频、办公等各类 AI 应用',
  openGraph: {
    title: `AI 工具发现 - ${siteConfig.name}`,
    description: '发现最新的 AI 工具，包括对话、图像、视频、办公等各类 AI 应用',
    url: `${siteConfig.url}/ai/discover`,
  },
};

export default async function DiscoverPage() {
  try {
    const { dict, lang } = await getDictionary();
    const list = getAllAI();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{dict.discover.title}</h1>
          <p className="text-sm text-muted-foreground">{dict.discover.subtitle}</p>
        </div>
        <DiscoverClient
          items={list}
          lang={lang}
          labels={{
            categories: [
              { key: '对话', name: dict.discover.categories.chat },
              { key: '图像', name: dict.discover.categories.image },
              { key: '视频', name: dict.discover.categories.video },
              { key: '办公', name: dict.discover.categories.office },
              { key: '音频', name: dict.discover.categories.audio },
              { key: '开发', name: dict.discover.categories.dev },
              { key: '搜索', name: dict.discover.categories.search },
              { key: '模型', name: dict.discover.categories.model }
            ],
            searchPlaceholder: dict.discover.searchPlaceholder,
            empty: dict.discover.empty,
            langFilter: dict.discover.langFilter
          }}
        />
      </main>
    );
  } catch (error: any) {
    console.error('[DiscoverPage] Error:', error);
    const fallback = await getDictionary();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{fallback.dict.discover.title}</h1>
        <p className="text-muted-foreground">加载失败，请稍后重试</p>
      </main>
    );
  }
}


