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
import { DownloadLink } from '@/components/DownloadLink';

export const revalidate = 3600;
// 移除 edge runtime 以启用静态生成（已有 generateStaticParams）
// export const runtime = 'edge';

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
  const downloads = Array.isArray(currentSoftware.downloads) ? currentSoftware.downloads : [];

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
      steps:
        downloads.length > 0
          ? downloads.map((step, index) => ({
              title: `${dict.software.step || '步骤'} ${index + 1}`,
              text: `${step.platform || '默认平台'} - ${step.version || currentSoftware.version || ''} ${dict.software.stepDownload || '下载并安装。'}`.trim(),
            }))
          : [
              { title: 'Step 1', text: 'Download the required files.' },
              { title: 'Step 2', text: 'Follow the installation guide described in the article.' },
            ],
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
          {downloads.map((entry) => {
            // 根据 source.type 获取源名称
            const getSourceName = (type?: string): string => {
              if (!type || typeof type !== 'string') return dict.software.sourceOther || '其他';
              const normalizedType = type.toLowerCase().trim();
              const sourceMap: Record<string, string> = {
                '123pan': dict.software.source123pan || '123云盘',
                'r2': dict.software.sourceR2 || 'Cloudflare R2',
                'other': dict.software.sourceOther || '其他',
              };
              return sourceMap[normalizedType] || dict.software.sourceOther || '其他';
            };

            // 生成下载链接标签
            const getSourceLabel = (source: { type?: string; label?: string }): string => {
              // 如果已有 label 且不是占位符，直接使用
              if (source.label && typeof source.label === 'string' && source.label.trim() && !source.label.includes('{source}')) {
                return source.label;
              }
              // 确保 type 存在
              if (!source.type || typeof source.type !== 'string') {
                return dict.software.download || '下载';
              }
              // 根据 type 生成标签
              const sourceName = getSourceName(source.type);
              if (!sourceName || sourceName.trim() === '') {
                return dict.software.download || '下载';
              }
              // 获取模板，确保是字符串
              const template = String(dict.software.downloadFrom || '从 {source} 下载').trim();
              
              // 使用全局替换确保所有占位符都被替换（包括 {source} 和 { source } 等变体）
              let label = template;
              
              // 替换所有可能的占位符格式
              label = label.replace(/\{\s*source\s*\}/gi, sourceName);
              
              // 如果替换后仍然包含占位符，直接使用源名称
              if (label.includes('{') && label.includes('}')) {
                // 如果还有未替换的占位符，直接返回源名称
                return sourceName;
              }
              
              // 确保返回的标签不为空
              return label.trim() || sourceName || dict.software.download || '下载';
            };

            // 生成下载链接 - 完全避免使用模板，直接生成标签
            const sources = (entry.sources && entry.sources.length ? entry.sources : [])
              .map((source) => {
                // 获取 source 类型和 URL
                const sourceType = String(source?.type || '').trim().toLowerCase();
                const sourceUrl = String(source?.url || '');
                
                // 根据类型获取源名称（不依赖模板）
                let sourceName = '';
                if (sourceType === '123pan') {
                  sourceName = dict.software.source123pan || '123云盘';
                } else if (sourceType === 'r2') {
                  sourceName = dict.software.sourceR2 || 'Cloudflare R2';
                } else if (sourceType === 'other') {
                  sourceName = dict.software.sourceOther || '其他';
                } else {
                  sourceName = dict.software.sourceOther || '其他';
                }
                
                // 检测语言并直接生成标签（不使用任何模板）
                const isEnglish = (dict.software.downloadFrom || '').includes('Download from');
                let label = '';
                
                if (isEnglish) {
                  // 英文格式
                  label = sourceName ? `Download from ${sourceName}` : (dict.software.download || 'Download');
                } else {
                  // 中文格式（默认）
                  label = sourceName ? `从 ${sourceName} 下载` : (dict.software.download || '下载');
                }
                
                // 绝对不允许占位符存在 - 如果检测到，直接使用源名称
                if (label.includes('{') || label.includes('source}')) {
                  console.warn('[SoftwareDetail] Detected placeholder in label, using source name directly:', { label, sourceType, sourceName });
                  label = sourceName || (isEnglish ? 'Download' : '下载');
                }
                
                return {
                  url: sourceUrl,
                  label: label.trim(), // 确保没有多余空格
                  secondary: sourceType ? `${sourceType.toUpperCase()} mirror` : undefined,
                };
              });
            const fallback = !sources.length && entry.url
              ? [{ url: entry.url, label: dict.software.download || '下载', secondary: undefined as string | undefined }]
              : [];
            const allLinks = [...sources, ...fallback];
            const mirrors = entry.mirrorUrls || [];

            return (
              <article key={`${entry.platform || 'unknown'}-${entry.version || currentSoftware.version || 'latest'}`} className="rounded-xl border border-border/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{entry.platform || '通用平台'}</div>
                  <span className="text-xs text-muted-foreground">{entry.version || currentSoftware.version}</span>
                </div>
                <div className="space-y-2">
                  {allLinks.map((link) => (
                    <DownloadLink
                      key={link.url}
                      href={link.url}
                      label={link.label}
                      secondary={link.secondary}
                      showHealthCheck={true}
                    />
                  ))}
                  {mirrors.map((url, index) => (
                    <DownloadLink
                      key={url}
                      href={url}
                      label={`${dict.software.mirrors || '备用'} ${index + 1}`}
                      showHealthCheck={true}
                      isMirror={true}
                    />
                  ))}
                  {!allLinks.length && !mirrors.length ? (
                    <span className="text-sm text-muted-foreground">{dict.software.downloadUnavailable || '暂未提供下载链接'}</span>
                  ) : null}
                </div>
              </article>
            );
          })}
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
