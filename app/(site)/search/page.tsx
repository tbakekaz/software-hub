import { getAllSoftware, getAllTutorials, getAllAI } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  try {
    const { dict, lang } = await getDictionary();
    const [software, tutorials, ai, params] = await Promise.all([
      getAllSoftware(),
      getAllTutorials(),
      getAllAI(),
      searchParams,
    ]);
    
    const query = params?.q || '';

    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{dict.nav.search}</h1>
        <SearchClient
          initialQuery={query}
          software={software}
          tutorials={tutorials}
          ai={ai}
          lang={lang}
          dict={dict}
        />
      </main>
    );
  } catch (error: any) {
    console.error('[SearchPage] Error:', error);
    const fallback = await getDictionary();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{fallback.dict.nav.search}</h1>
        <p className="text-muted-foreground">加载失败，请稍后重试</p>
      </main>
    );
  }
}
