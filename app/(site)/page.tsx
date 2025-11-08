import RatesCard from '@/components/RatesCard';
import { getAllSoftware, getAllTutorials, getAllAI } from '@/lib/content-edge';
import { SoftwareCard } from '@/components/SoftwareCard';
import { TutorialCard } from '@/components/TutorialCard';
import { AIItemCard } from '@/components/AIItemCard';
import { MonetizeSlot } from '@/components/MonetizeSlot';
import { getDictionary } from '@/lib/i18n/server';
import type { Software, TutorialMeta, AIItem } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function HomePage() {
  // 添加错误处理，确保页面始终可以渲染
  let dict: Awaited<ReturnType<typeof getDictionary>>['dict'];
  let lang: Lang;
  let software: Software[];
  let tutorials: TutorialMeta[];
  let ai: AIItem[];
  
  try {
    const result = await getDictionary();
    dict = result.dict;
    lang = result.lang;
    
    // 优先显示 soft-a (Adobe Soft)，然后显示其他软件
    const allSoftware = getAllSoftware();
    const softA = allSoftware.find((s) => s.slug === 'soft-a');
    const otherSoftware = allSoftware.filter((s) => s.slug !== 'soft-a');
    software = softA ? [softA, ...otherSoftware].slice(0, 3) : allSoftware.slice(0, 3);
    tutorials = getAllTutorials().slice(0, 2);
    ai = getAllAI().filter((i) => i.isFeatured).slice(0, 6);
  } catch (error) {
    // 如果任何步骤失败，使用默认值
    const fallback = await getDictionary();
    dict = fallback.dict;
    lang = fallback.lang;
    software = [];
    tutorials = [];
    ai = [];
  }
  return (
    <main className="container mx-auto px-4 py-12 space-y-12">
      <section className="text-center space-y-5 rounded-2xl border bg-white/60 dark:bg-black/30 backdrop-blur px-4 py-10 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-sky-500 to-fuchsia-500 bg-clip-text text-transparent">{dict.home.title}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">{dict.home.subtitle}</p>
        <div className="max-w-3xl mx-auto">
          <MonetizeSlot position="home-below-hero" />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="font-semibold mb-3 text-sky-600 dark:text-sky-400">{dict.section.recommendedSoftware}</h2>
          <div className="grid gap-3">
            {software.map((s) => (
              <SoftwareCard key={s.slug} item={s} lang={lang} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-3 text-fuchsia-600 dark:text-fuchsia-400">{dict.rates.title}</h2>
          {/* 服务端 + ISR */}
          <RatesCard />
        </div>
      </section>

      {/* 区块间广告位 */}
      <div className="my-8">
        <MonetizeSlot position="home-between-sections" />
      </div>

      <section className="pt-4">
        <h2 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">{dict.section.latestTutorials}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {tutorials.map((t) => (
            <TutorialCard key={t.slug} tutorial={t} lang={lang} dict={dict} />
          ))}
        </div>
      </section>

      <section className="pt-2">
        <h2 className="font-semibold mb-3 text-rose-600 dark:text-rose-400">{dict.section.aiFeatured}</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {ai.map((i) => (
            <AIItemCard key={i.name} item={i} lang={lang} />
          ))}
        </div>
        {/* 已移除页脚广告位 */}
      </section>
    </main>
  );
}

