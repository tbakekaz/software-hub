import { getTutorialBySlug } from '@/lib/content-edge';
import { notFound } from 'next/navigation';
import { articleSchema, breadcrumbSchema, howToSchema } from '@/lib/seo';
import { MonetizeSlot } from '@/components/MonetizeSlot';
import { MarkdownContent } from '@/components/MarkdownContent';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getTutorialBySlug(slug);
  if (!data) return {};

  const url = `${siteConfig.url}/tutorials/${slug}`;
  const summary = data.meta.summary || data.meta.title;

  return {
    title: `${data.meta.title} - ${siteConfig.name}`,
    description: summary,
    keywords: [data.meta.title, ...(data.meta.tags || [])].join(', '),
    openGraph: {
      title: `${data.meta.title} - ${siteConfig.name}`,
      description: summary,
      url,
      type: 'article',
      publishedTime: data.meta.date,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.meta.title} - ${siteConfig.name}`,
      description: summary,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TutorialDetail({ params }: PageProps) {
  const { slug } = await params;
  const data = getTutorialBySlug(slug);
  if (!data) return notFound();

  const baseUrl = siteConfig.url;
  const tutorialUrl = `${baseUrl}/tutorials/${data.meta.slug}`;

  const structuredData = [
    articleSchema({
      title: data.meta.title,
      url: tutorialUrl,
      datePublished: data.meta.date,
      description: data.meta.summary,
    }),
    breadcrumbSchema([
      { name: siteConfig.name, url: baseUrl },
      { name: 'Tutorials', url: `${baseUrl}/tutorials` },
      { name: data.meta.title, url: tutorialUrl },
    ]),
    howToSchema({
      name: data.meta.title,
      description: data.meta.summary,
      url: tutorialUrl,
      steps:
        (Array.isArray((data.meta as any).steps)
          ? ((data.meta as any).steps as Array<{ title: string; text: string }>).map((step) => ({
              title: step.title,
              text: step.text,
            }))
          : undefined) || [
          { title: 'Step 1', text: 'Download the required files.' },
          { title: 'Step 2', text: 'Follow the installation guide described in the article.' },
        ],
    }),
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{data.meta.title}</h1>
        <p className="text-sm text-muted-foreground">{data.meta.date}</p>
      </header>
      <MonetizeSlot position="in-article" />
      <article className="prose dark:prose-invert max-w-none">
        <MarkdownContent content={data.content} />
      </article>
    </main>
  );
}

