"use client";
import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SoftwareCard } from '@/components/SoftwareCard';
import { TutorialCard } from '@/components/TutorialCard';
import { AIItemCard } from '@/components/AIItemCard';
import type { Software, TutorialMeta, AIItem } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';
import { pickLocaleString } from '@/lib/i18n/translate';

interface Props {
  initialQuery: string;
  software: ReadonlyArray<Software>;
  tutorials: ReadonlyArray<TutorialMeta>;
  ai: ReadonlyArray<AIItem>;
  lang: Lang;
  dict: any;
}

export default function SearchClient({ initialQuery, software, tutorials, ai, lang, dict }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return {
        software: [] as Software[],
        tutorials: [] as TutorialMeta[],
        ai: [] as AIItem[],
      };
    }

    const keyword = query.toLowerCase().trim();

    const filteredSoftware = software.filter((s) => {
      const name = pickLocaleString(s.name_i18n || s.name, lang).toLowerCase();
      const desc = pickLocaleString(s.description_i18n || s.description, lang).toLowerCase();
      const category = s.category?.toLowerCase() || '';
      return name.includes(keyword) || desc.includes(keyword) || category.includes(keyword);
    });

    const filteredTutorials = tutorials.filter((t) => {
      const title = t.title.toLowerCase();
      const summary = (t.summary || '').toLowerCase();
      return title.includes(keyword) || summary.includes(keyword);
    });

    const filteredAI = ai.filter((item) => {
      const name = pickLocaleString(item.name_i18n || item.name, lang).toLowerCase();
      const desc = pickLocaleString(item.description_i18n || item.description, lang).toLowerCase();
      const tags = item.tags.join(' ').toLowerCase();
      return name.includes(keyword) || desc.includes(keyword) || tags.includes(keyword);
    });

    return {
      software: filteredSoftware,
      tutorials: filteredTutorials,
      ai: filteredAI,
    };
  }, [query, software, tutorials, ai, lang]);

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    router.push(`/search?${params.toString()}`);
  };

  const total = filtered.software.length + filtered.tutorials.length + filtered.ai.length;

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="search"
          placeholder={dict.nav.searchPlaceholder || '搜索软件、教程、AI 工具...'}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {query.trim() && (
        <div className="text-sm text-muted-foreground">{dict.search?.resultCount?.replace('{count}', String(total)) || `找到 ${total} 个结果`}</div>
      )}

      {filtered.software.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">软件 ({filtered.software.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.software.map((s) => (
              <SoftwareCard key={s.slug} item={s} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {filtered.tutorials.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">教程 ({filtered.tutorials.length})</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.tutorials.map((t) => (
              <TutorialCard key={t.slug} tutorial={t} lang={lang} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {filtered.ai.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">AI 工具 ({filtered.ai.length})</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.ai.map((item) => (
              <AIItemCard key={item.name} item={item} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {query.trim() && total === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>{dict.search?.empty || '未找到相关结果'}</p>
          <p className="text-sm mt-2">{dict.search?.tryAnother || '请尝试其他关键词'}</p>
        </div>
      )}

      {!query.trim() && (
        <div className="text-center py-12 text-muted-foreground">
          <p>{dict.search?.hint || '输入关键词开始搜索'}</p>
        </div>
      )}
    </div>
  );
}
