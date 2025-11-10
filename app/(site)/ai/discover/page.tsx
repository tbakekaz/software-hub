import { getAllAI } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import DiscoverClient from './DiscoverClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function DiscoverPage() {
  try {
    const { dict, lang } = await getDictionary();
    const list = await getAllAI();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{dict.discover.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{dict.discover.subtitle}</p>
        </div>
        <DiscoverClient 
          items={list} 
          lang={lang} 
          labels={{
            categories: Object.entries(dict.discover.categories).map(([key, name]) => ({ key, name: String(name) })),
            searchPlaceholder: dict.discover.searchPlaceholder,
            empty: dict.discover.empty,
            langFilter: dict.discover.langFilter,
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
