'use client';

import Link from 'next/link';
import type { Software } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';
import { pickLocaleString } from '@/lib/i18n/translate';
import { SoftwareCard } from '@/components/SoftwareCard';
import { CardBase, CardHeader, CardBody, CardBadge } from '@/components/CardBase';
import { clsx } from 'clsx';

interface CategoryHubProps {
  category: string;
  categoryDescription: string;
  software: ReadonlyArray<Software>;
  lang: Lang;
  dict: any;
  faqs?: Array<{ question: string; answer: string }>;
  comparison?: Array<{ name: string; pros: string[]; cons: string[] }>;
  useCases?: Array<{ title: string; description: string; recommended: string[] }>;
}

export function CategoryHub({
  category,
  categoryDescription,
  software,
  lang,
  dict,
  faqs = [],
  comparison = [],
  useCases = [],
}: CategoryHubProps) {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl border bg-gradient-to-br from-background via-background to-primary/5 px-6 py-10 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{category}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">{categoryDescription}</p>
      </section>

      {/* Quick Navigation */}
      <nav className="flex flex-wrap gap-2 text-sm" aria-label="页面导航">
        <a href="#software-list" className="rounded-full border px-3 py-1 hover:bg-accent">软件列表</a>
        {useCases.length > 0 && <a href="#use-cases" className="rounded-full border px-3 py-1 hover:bg-accent">使用场景</a>}
        {comparison.length > 0 && <a href="#comparison" className="rounded-full border px-3 py-1 hover:bg-accent">对比选型</a>}
        {faqs.length > 0 && <a href="#faq" className="rounded-full border px-3 py-1 hover:bg-accent">常见问题</a>}
      </nav>

      {/* Software List */}
      <section id="software-list" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">精选软件 ({software.length})</h2>
          <Link href="/software" className="text-sm text-primary hover:underline">查看全部 →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {software.map((item) => (
            <SoftwareCard key={item.slug} item={item} lang={lang} />
          ))}
        </div>
      </section>

      {/* Use Cases */}
      {useCases.length > 0 && (
        <section id="use-cases" className="space-y-4">
          <h2 className="text-2xl font-semibold">使用场景与推荐</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {useCases.map((useCase, index) => (
              <CardBase key={index} className="p-5">
                <CardHeader>
                  <h3 className="text-lg font-semibold">{useCase.title}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                  {useCase.recommended.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">推荐软件：</p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.recommended.map((name) => {
                          const item = software.find((s) => s.name.toLowerCase().includes(name.toLowerCase()));
                          return item ? (
                            <Link
                              key={item.slug}
                              href={`/software/${item.slug}`}
                              className="text-xs px-2 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                            >
                              {pickLocaleString(item.name_i18n || item.name, lang)}
                            </Link>
                          ) : (
                            <span key={name} className="text-xs px-2 py-1 rounded-full border bg-muted">
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardBody>
              </CardBase>
            ))}
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {comparison.length > 0 && (
        <section id="comparison" className="space-y-4">
          <h2 className="text-2xl font-semibold">软件对比</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">软件</th>
                  <th className="px-4 py-3 text-left font-semibold">优势</th>
                  <th className="px-4 py-3 text-left font-semibold">劣势</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className={clsx('border-t', index % 2 === 0 ? 'bg-background' : 'bg-muted/20')}>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <ul className="space-y-1">
                        {item.pros.map((pro, i) => (
                          <li key={i} className="text-green-600 dark:text-green-400">✓ {pro}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="space-y-1">
                        {item.cons.map((con, i) => (
                          <li key={i} className="text-muted-foreground">• {con}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section id="faq" className="space-y-4">
          <h2 className="text-2xl font-semibold">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <CardBase key={index} className="p-5">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardBase>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

