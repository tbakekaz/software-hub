import { getAllTutorials, getTutorialBySlug } from '@/lib/content-edge';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { articleSchema } from '@/lib/seo';
import { MonetizeSlot } from '@/components/MonetizeSlot';

export const runtime = 'edge';

export default async function TutorialDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getTutorialBySlug(slug);
  if (!data) return notFound();
  const jsonld = articleSchema({
    title: data.meta.title,
    url: `https://example.com/tutorials/${data.meta.slug}`,
    datePublished: data.meta.date,
    description: data.meta.summary
  });
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <h1 className="text-2xl font-semibold">{data.meta.title}</h1>
      {/* 文内首段后广告位（除 MDX 内可用的 MonetizeSlot 外再加一处） */}
      <MonetizeSlot position="in-article" />
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </article>
    </main>
  );
}

