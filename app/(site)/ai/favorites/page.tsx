import { getAllAI } from '@/lib/content';
import { getDictionary } from '@/lib/i18n/server';
import FavoritesClient from './FavoritesClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function FavoritesPage() {
  const { dict, lang } = await getDictionary();
  const list = getAllAI();
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">{dict.favorites.title}</h1>
      <FavoritesClient items={list} lang={lang} />
    </main>
  );
}


