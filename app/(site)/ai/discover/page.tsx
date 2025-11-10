import { getAllAI } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import Link from 'next/link';
import DiscoverClient from './DiscoverClient';

// Ensure we run on Node.js (content-edge may rely on Node APIs) and avoid static caching
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DiscoverPage() {
  // 1) Get dictionary defensively (don't let i18n failure crash the page)
  const dictResult = await getDictionary().catch((e: unknown) => {
    console.error('[DiscoverPage] getDictionary error:', e);
    return null as any;
  });

  // Fallbacks for when dictionary fails
  const lang = dictResult?.lang ?? 'zh';
  const dict = (dictResult?.dict ?? {}) as any;
  const d = (dict?.discover ?? {}) as any;

  // Discover texts (fallbacks)
  const title = d?.title ?? 'AI 工具发现';
  const subtitle = d?.subtitle ?? '精选与分类，让你更快找到合适的工具';
  const searchPlaceholder = d?.searchPlaceholder ?? '搜索工具名称、功能或标签…';
  const empty = d?.empty ?? '暂无数据';
  const langFilter = d?.langFilter ?? '语言筛选';

  // 2) Get list defensively (if content source fails, show empty state)
  let list: any[] = [];
  try {
    const res = await getAllAI();
    list = Array.isArray(res) ? res : [];
  } catch (e) {
    console.error('[DiscoverPage] getAllAI error:', e);
    list = [];
  }

  // 3) Safe categories map
  const categoriesDict = (d?.categories ?? {}) as Record<string, string>;
  const categories = Object.entries(categoriesDict).map(([key, name]) => ({ key, name: String(name) }));

  // --- Landing-fallback 文案（不依赖词典，确保可渲染） ---
  const L = {
    heroTitle: '中亚用户必备的 AI + 软件资源中心',
    heroSub: '精选工具、实用教程与本地化支持，让学习、创作与变现更轻松。',
    ctaUse: '开始使用',
    ctaTutorial: '查看教程',
    intents: {
      video: 'AI 视频创作',
      writing: 'AI 写作与翻译',
      download: '常用软件下载',
      onboarding: '新手快速入门',
    },
    weekly: {
      title: '本周推荐',
      items: ['CapCut 模板包', 'DeepL + ChatGPT 组合', '高速 VPN']
    },
    solutions: {
      title: '常用解决方案',
      list: ['新手做短视频：选题→脚本→素材→模板→发布', '跨语种账号：采编→翻译→配音→排版→数据复盘', 'AI 辅助写作：提示词→结构→细化→检查→发布']
    },
    membership: {
      title: '会员权益',
      plans: [
        { name: '基础', features: ['不限速下载', '资源更新通知'] },
        { name: '学习', features: ['全部下载', '全套教程', '模板包'] },
        { name: '创业', features: ['1v1 答疑', '变现方案', '素材库'] },
      ],
      cta: '立即加入会员'
    },
    faq: {
      title: '常见问答',
      qa: [
        { q: '是否长期维护？', a: '是，我们每周更新。' },
        { q: '支持哪些语言？', a: '中文 / 哈萨克语 / 俄语。' },
        { q: '如何退款？', a: '7 天内不满意可申请。' },
      ]
    },
    footer: {
      title: '获取完整资源与教程',
      btn: '立即加入'
    }
  } as const;

  return (
    <main className="container mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold">{L.heroTitle}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{L.heroSub}</p>
        <div className="flex gap-3 justify-center">
          <Link className="btn btn-primary" href="#discover">{L.ctaUse}</Link>
          <Link className="btn btn-outline" href="/tutorials">{L.ctaTutorial}</Link>
        </div>
      </section>

      {/* Intents */}
      <section className="grid md:grid-cols-4 gap-4">
        {[
          { href: '/ai/video', label: L.intents.video },
          { href: '/ai/writing', label: L.intents.writing },
          { href: '/software', label: L.intents.download },
          { href: '/onboarding', label: L.intents.onboarding },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card p-5 border rounded-lg hover:shadow">
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </section>

      {/* Weekly */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{L.weekly.title}</h2>
          <Link href="/weekly" className="text-sm text-primary">全部查看</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {L.weekly.items.map((name) => (
            <div key={name} className="border rounded-lg p-5">{name}</div>
          ))}
        </div>
      </section>

      {/* Discover (原有功能) */}
      <section id="discover" className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <DiscoverClient
          items={list}
          lang={lang}
          labels={{
            categories,
            searchPlaceholder,
            empty,
            langFilter,
          }}
        />
      </section>

      {/* Solutions */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{L.solutions.title}</h2>
        <ul className="grid md:grid-cols-3 gap-4">
          {L.solutions.list.map((s) => (
            <li key={s} className="border rounded-lg p-5">{s}</li>
          ))}
        </ul>
      </section>

      {/* Membership */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{L.membership.title}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {L.membership.plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-5">
              <h3 className="font-medium mb-2">{plan.name}</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <Link href="/membership" className="btn btn-primary">{L.membership.cta}</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{L.faq.title}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {L.faq.qa.map((item) => (
            <div key={item.q} className="border rounded-lg p-5">
              <p className="font-medium">{item.q}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium">{L.footer.title}</h3>
        <Link href="/membership" className="btn btn-primary mt-3 inline-block">{L.footer.btn}</Link>
      </section>
    </main>
  );
}
