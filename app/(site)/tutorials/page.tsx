import { getAllTutorials } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import { TutorialCard } from '@/components/TutorialCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TutorialsPage() {
  try {
    const { dict, lang } = await getDictionary();
    const list = getAllTutorials();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{dict.tutorials.title}</h1>
        <ul className="space-y-3">
          {list.map((t) => (
            <li key={t.slug}>
              <TutorialCard tutorial={t} lang={lang} dict={dict} />
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (error: any) {
    console.error('[TutorialsPage] Error:', error);
    const fallback = await getDictionary();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{fallback.dict.tutorials.title}</h1>
        <p className="text-muted-foreground">暂无教程</p>
      </main>
    );
  }
}


