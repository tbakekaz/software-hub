import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n/server';
import { pickLocaleString } from '@/lib/i18n/translate';
import { getSoftware, getAllSoftware } from '@/lib/content-edge';
import { getRelatedSoftware } from '@/lib/recommendations';
import { softwareSchema, breadcrumbSchema, faqSchema, howToSchema, reviewSchema } from '@/lib/seo';
import { RelatedSoftwareCard } from '@/components/RelatedSoftwareCard';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const all = await getAllSoftware();
    return (all || []).map((s: { slug: string }) => ({ slug: s.slug }));
  } catch (e) {
    console.warn('[SoftwareDetail] generateStaticParams fallback', e);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSoftware(slug);
  if (!data) return {};

  const { lang } = await getDictionary();
  const title = pickLocaleString(data.name_i18n || data.name, lang);
  const description = pickLocaleString(data.description_i18n || data.description, lang);
  const url = `${siteConfig.url}/software/${slug}`;

  return {
    title: `${title} - ${siteConfig.name}`,
    description,
    keywords: [title, data.category, ...(data.platforms || [])].filter(Boolean) as string[],
    openGraph: {
      title: `${title} - ${siteConfig.name}`,
      description,
      url,
      type: 'website',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary',
      title: `${title} - ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function SoftwareDetail({ params }: PageProps) {
  const { slug } = await params;
  const [dictionaryResult, currentSoftware] = await Promise.all([
    getDictionary(),
    getSoftware(slug),
  ]);

  if (!currentSoftware) {
    return notFound();
  }

  const { dict, lang } = dictionaryResult;
  const title = pickLocaleString(currentSoftware.name_i18n || currentSoftware.name, lang);
  const description = pickLocaleString(currentSoftware.description_i18n || currentSoftware.description, lang);

  const relatedSoftware = await (async () => {
    try {
      const allSoftware = await getAllSoftware();
      return getRelatedSoftware(currentSoftware, allSoftware, 6);
    } catch (error) {
      console.warn('[SoftwareDetail] related software error', error);
      return [];
    }
  })();

  const baseUrl = siteConfig.url;
  const softwareUrl = `${baseUrl}/software/${slug}`;

  const structuredData = [
    softwareSchema({
      name: title,
      url: softwareUrl,
      version: currentSoftware.version,
      operatingSystems: currentSoftware.platforms,
      description,
    }),
    breadcrumbSchema([
      { name: siteConfig.name, url: baseUrl },
      { name: dict.nav.software, url: `${baseUrl}/software` },
      { name: title, url: softwareUrl },
    ]),
    faqSchema([
      {
        question: dict.software.faqDownload || '如何下载软件？',
        answer: dict.software.faqDownloadAnswer || '选择合适的下载链接，使用备用地址或镜像以确保速度。',
      },
      {
        question: dict.software.faqUpdate || '如何获取最新版本？',
        answer: dict.software.faqUpdateAnswer || `我们会定期更新，当前版本：${currentSoftware.version}`,
      },
    ]),
    howToSchema({
      name: dict.software.howToTitle || `${title} 安装指南`,
      description: dict.software.howToDescription || '按照以下步骤完成安装。',
      url: softwareUrl,
      steps: currentSoftware.downloads.map((step, index) => ({
        title: `${dict.software.step || '步骤'} ${index + 1}`,
        text: `${step.platform} - ${step.version || currentSoftware.version} ${dict.software.stepDownload || '下载并安装。'}`,
      })),
    }),
    reviewSchema({
      name: title,
      url: softwareUrl,
      ratingValue: 4.8,
      reviewCount: 128,
      author: dict.software.reviewAuthor || 'Software Hub 团队',
      reviewBody: dict.software.reviewSummary || `${title} 在 ${(currentSoftware.platforms || []).join(', ') || '各主流平台'} 上拥有稳定表现。`,
    }),
  ];

  return (
    <main className="container mx-auto px-4 py-10 space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <span className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">v{currentSoftware.version}</span>
        </div>
        <p className="max-w-3xl text-muted-foreground leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground/80">
          {currentSoftware.category && <span className="px-2 py-1 rounded border border-border/60">{currentSoftware.category}</span>}
          {(currentSoftware.platforms || []).map((platform) => (
            <span key={platform} className="px-2 py-1 rounded border border-border/60">
              {platform}
            </span>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{dict.software.downloadSection || '下载地址'}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {currentSoftware.downloads.map((entry) => (
            <article key={`${entry.platform || 'unknown'}-${entry.version || currentSoftware.version || 'latest'}`} className="rounded-xl border border-border/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{entry.platform}</div>
                <span className="text-xs text-muted-foreground">{entry.version || currentSoftware.version}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {entry.sources?.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="block text-primary hover:underline">
                    {source.label || dict.software.downloadFrom || '下载'}
                  </a>
                )) || (entry.url ? (
                  <a href={entry.url} target="_blank" rel="noopener noreferrer nofollow" className="block text-primary hover:underline">
                    {dict.software.download || '下载'}
                  </a>
                ) : (
                  <span>{dict.software.downloadUnavailable || '暂未提供下载链接'}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {relatedSoftware.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{dict.software.related}</h2>
            <Link href="/software" className="text-sm text-primary hover:underline">
              {dict.software.backToList || '返回列表'}
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedSoftware.map((item) => (
              <RelatedSoftwareCard key={item.slug} item={item} lang={lang} dict={dict} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
