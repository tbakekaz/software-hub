import { getAllSoftware, getSoftware } from '@/lib/content';
import { notFound } from 'next/navigation';
import { softwareSchema } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n/server';
import { pickLocaleString } from '@/lib/i18n/translate';
import { RelatedSoftwareCard } from '@/components/RelatedSoftwareCard';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSoftware().map((s) => ({ slug: s.slug }));
}

export default async function SoftwareDetail({ params }: Props) {
  const { slug } = await params;
  const { dict, lang } = await getDictionary();
  const data = getSoftware(slug);
  if (!data) return notFound();
  const title = pickLocaleString(data.name_i18n || data.name, lang);
  const desc = pickLocaleString(data.description_i18n || data.description, lang);
  
  // 获取相关软件：如果软件名称包含 "Adobe"，显示其他 Adobe 软件
  const relatedSoftware = (() => {
    if (!data.name.toLowerCase().includes('adobe')) return [];
    const all = getAllSoftware();
    return all
      .filter((s) => s.slug !== data.slug && s.name.toLowerCase().includes('adobe'))
      .slice(0, 6); // 最多显示 6 个
  })();
  const jsonld = softwareSchema({
    name: data.name,
    url: `https://example.com/software/${slug}`,
    version: data.version,
    operatingSystems: data.platforms
  });
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <span className="text-sm text-muted-foreground">v{data.version}</span>
      </div>
      <p>{desc}</p>
      
      {relatedSoftware.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{dict.software.related}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedSoftware.map((item) => (
              <RelatedSoftwareCard key={item.slug} item={item} lang={lang} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}


