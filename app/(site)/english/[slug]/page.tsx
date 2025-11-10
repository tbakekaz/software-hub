import { getEnglishBySlug } from '@/lib/content-edge';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/server';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getEnglishBySlug(slug);
  if (!resource) return {};

  const title = resource.title;
  const description = resource.description;

  return {
    title: `${title} - ${siteConfig.name}`,
    description,
    openGraph: {
      title: `${title} - ${siteConfig.name}`,
      description,
      type: 'article',
    },
  };
}

export default async function EnglishDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getEnglishBySlug(slug);
  if (!resource) return notFound();

  const { lang } = await getDictionary();
  const title = pickLocaleString(resource.title_i18n || resource.title, lang);
  const description = pickLocaleString(resource.description_i18n || resource.description, lang);

  const categoryLabels: Record<string, string> = {
    grammar: '语法',
    vocabulary: '词汇',
    listening: '听力',
    speaking: '口语',
    reading: '阅读',
    writing: '写作',
    course: '课程',
  };

  const levelLabels: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary capitalize">
            {levelLabels[resource.level] || resource.level}
          </span>
          <span className="px-2 py-1 text-xs rounded border capitalize">
            {categoryLabels[resource.category] || resource.category}
          </span>
          {resource.isFree && (
            <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-600">
              免费
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {resource.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs rounded bg-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">学习资源</h2>
        <div className="grid gap-4">
          {resource.resources.map((res, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{res.title}</h3>
                <span className="px-2 py-1 text-xs rounded bg-muted capitalize">
                  {res.type}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                {res.duration && <span>⏱️ {res.duration}</span>}
                {res.size && <span>📦 {res.size}</span>}
                {res.format && <span>📄 {res.format.toUpperCase()}</span>}
              </div>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                查看/下载 →
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

