import RatesCard from '@/components/RatesCard';
import { getAllSoftware, getAllTutorials, getAllAI } from '@/lib/content-edge';
import { SoftwareCard } from '@/components/SoftwareCard';
import { TutorialCard } from '@/components/TutorialCard';
import { AIItemCard } from '@/components/AIItemCard';
import { MonetizeSlot } from '@/components/MonetizeSlot';
import { AdCard } from '@/components/AdCard';
import { getDictionary } from '@/lib/i18n/server';
import Link from 'next/link';
import type { Software, TutorialMeta, AIItem } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// 移除 edge runtime 以支持汇率 API 调用
// export const runtime = 'edge';

export const metadata = {
  title: 'KazSoft — AI & Software Hub',
  alternates: {
    languages: {
      'x-default': '/',
      'zh-KZ': '/zh',
      'kk-KZ': '/kk',
      'ru-RU': '/ru',
      'en': '/en',
    },
  },
};

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
    const allSoftware = await getAllSoftware();
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

      {/* 语言学习入口 - 放在汇率窗口上面 */}
      <section className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">🌍 {dict.nav.languages || '学习语言'}</h2>
            <p className="text-muted-foreground mb-4">
              {dict.languages?.subtitle || '精选视频、文档、音频学习材料，支持一键翻译，让学习更轻松'}
            </p>
            <Link
              href="/languages"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
            >
              {lang === 'zh' ? '开始学习' : lang === 'kk' ? 'Үйренуді бастау' : lang === 'ru' ? 'Начать обучение' : 'Start Learning'} →
            </Link>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-lg bg-background/80 border text-center">
              <div className="text-2xl mb-1">🇬🇧</div>
              <div className="text-xs font-medium">{dict.languages?.targetLanguage?.english || '英语'}</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-background/80 border text-center">
              <div className="text-2xl mb-1">🇨🇳</div>
              <div className="text-xs font-medium">{dict.languages?.targetLanguage?.chinese || '中文'}</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-background/80 border text-center">
              <div className="text-2xl mb-1">🇰🇿</div>
              <div className="text-xs font-medium">{dict.languages?.targetLanguage?.kazakh || '哈萨克语'}</div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-background/80 border text-center">
              <div className="text-2xl mb-1">🇷🇺</div>
              <div className="text-xs font-medium">{dict.languages?.targetLanguage?.russian || '俄语'}</div>
            </div>
          </div>
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

      <section>
        <AdCard
          title={dict.software.reviewAuthor || 'Software Hub Pro'}
          description={dict.pricing?.desc || 'Unlock ad-free browsing, faster mirrors and AI enhancements.'}
          href="/pricing"
          ctaLabel={dict.pricing?.cta || 'Upgrade now'}
          icon="🚀"
        />
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

