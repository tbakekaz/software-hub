import { getAllTutorials, getTutorialBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import { articleSchema } from '@/lib/seo';
import { MonetizeSlot } from '@/components/MonetizeSlot';

export function generateStaticParams() {
  return getAllTutorials().map((t) => ({ slug: t.slug }));
}

export default async function TutorialDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getTutorialBySlug(slug);
  if (!data) return notFound();
  const MDX = (props: any) => <MDXRemote source={data.content} components={useMDXComponents({})} {...props} />;
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
        <MDX />
      </article>
    </main>
  );
}

