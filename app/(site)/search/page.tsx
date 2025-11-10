import { getAllSoftware, getAllTutorials, getAllAI } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata: Metadata = {
  title: `搜索 - ${siteConfig.name}`,
  description: '搜索软件、教程和 AI 工具',
  robots: {
    index: false,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { dict, lang } = await getDictionary();

  const [software, tutorials, ai] = await Promise.all([
    getAllSoftware(),
    Promise.resolve(getAllTutorials()),
    Promise.resolve(getAllAI()),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">{dict.nav.search || '搜索'}</h1>
      <SearchClient
        initialQuery={q || ''}
        software={software}
        tutorials={tutorials}
        ai={ai}
        lang={lang}
        dict={dict}
      />
    </main>
  );
}
