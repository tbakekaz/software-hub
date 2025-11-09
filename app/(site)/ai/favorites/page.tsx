import { getAllAI } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import FavoritesClient from './FavoritesClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function FavoritesPage() {
  try {
    const { dict, lang } = await getDictionary();
    const list = getAllAI();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{dict.favorites.title}</h1>
        <FavoritesClient items={list} lang={lang} />
      </main>
    );
  } catch (error: any) {
    console.error('[FavoritesPage] Error:', error);
    const fallback = await getDictionary();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{fallback.dict.favorites.title}</h1>
        <p className="text-muted-foreground">加载失败，请稍后重试</p>
      </main>
    );
  }
}


