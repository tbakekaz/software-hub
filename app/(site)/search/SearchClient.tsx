"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SoftwareCard } from '@/components/SoftwareCard';
import { TutorialCard } from '@/components/TutorialCard';
import { AIItemCard } from '@/components/AIItemCard';
import type { Software, TutorialMeta, AIItem } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';
import { pickLocaleString } from '@/lib/i18n/translate';
import { fuzzyMatch, filterByPlatform, filterByCategory, filterByUpdateTime } from '@/lib/search-utils';

const RESULT_TYPES = [
  { key: 'all', label: '全部' },
  { key: 'software', label: '软件' },
  { key: 'tutorials', label: '教程' },
  { key: 'ai', label: 'AI' },
] as const;

const PLATFORMS = [
  { key: 'all', label: '全部平台' },
  { key: 'Windows', label: 'Windows' },
  { key: 'macOS', label: 'macOS' },
  { key: 'Linux', label: 'Linux' },
  { key: 'Web', label: 'Web' },
] as const;

const TIME_RANGES = [
  { key: 'all', label: '全部时间' },
  { key: 'week', label: '最近一周' },
  { key: 'month', label: '最近一月' },
  { key: 'year', label: '最近一年' },
] as const;

type ResultType = typeof RESULT_TYPES[number]['key'];
type Platform = typeof PLATFORMS[number]['key'];
type TimeRange = typeof TIME_RANGES[number]['key'];

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
  const [activeType, setActiveType] = useState<ResultType>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    software.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['all', ...Array.from(set)];
  }, [software]);

  const filtered = useMemo(() => {
    let filteredSoftware = [...software];
    let filteredTutorials = [...tutorials];
    let filteredAI = [...ai];

    // 关键词搜索（支持同义词和拼写容错）
    if (query.trim()) {
      filteredSoftware = filteredSoftware.filter((s) => {
        const name = pickLocaleString(s.name_i18n || s.name, lang);
        const desc = pickLocaleString(s.description_i18n || s.description, lang);
        const category = s.category || '';
        return fuzzyMatch(`${name} ${desc} ${category}`, query);
      });

      filteredTutorials = filteredTutorials.filter((t) => {
        const title = t.title || '';
        const summary = t.summary || '';
        return fuzzyMatch(`${title} ${summary}`, query);
      });

      filteredAI = filteredAI.filter((item) => {
        const name = pickLocaleString(item.name_i18n || item.name, lang);
        const desc = pickLocaleString(item.description_i18n || item.description, lang);
        const tags = item.tags.join(' ');
        return fuzzyMatch(`${name} ${desc} ${tags}`, query);
      });
    }

    // 平台筛选（仅软件）
    if (platformFilter !== 'all') {
      filteredSoftware = filterByPlatform(filteredSoftware, platformFilter) as Software[];
    }

    // 类别筛选（仅软件）
    if (categoryFilter !== 'all') {
      filteredSoftware = filterByCategory(filteredSoftware, categoryFilter, lang) as Software[];
    }

    // 更新时间筛选（仅软件）
    if (timeRange !== 'all') {
      filteredSoftware = filterByUpdateTime(filteredSoftware, timeRange) as Software[];
    }

    return {
      software: filteredSoftware,
      tutorials: filteredTutorials,
      ai: filteredAI,
    };
  }, [query, software, tutorials, ai, lang, platformFilter, categoryFilter, timeRange]);

  useEffect(() => {
    if (!query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch('/api/track/search', {
        method: 'POST',
        body: JSON.stringify({ query: query.trim(), type: activeType }),
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      }).catch(() => {});
    }, 600);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, activeType]);

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    router.replace(`/search?${params.toString()}`);
  };

  const total = filtered.software.length + filtered.tutorials.length + filtered.ai.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar text-sm" aria-label="结果类型">
          {RESULT_TYPES.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setActiveType(type.key)}
              className={
                'rounded-full border px-3 py-1 transition ' +
                (activeType === type.key
                  ? 'bg-foreground text-background'
                  : 'bg-background hover:bg-accent hover:text-accent-foreground')
              }
            >
              {type.label}
              {type.key === 'software' && filtered.software.length ? ` · ${filtered.software.length}` : ''}
              {type.key === 'tutorials' && filtered.tutorials.length ? ` · ${filtered.tutorials.length}` : ''}
              {type.key === 'ai' && filtered.ai.length ? ` · ${filtered.ai.length}` : ''}
            </button>
          ))}
        </div>
        <div className="w-full md:w-80">
          <Input
            type="search"
            placeholder={dict.nav.searchPlaceholder || '搜索软件、教程、AI 工具...'}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* 筛选器（仅软件类型时显示） */}
      {activeType === 'all' || activeType === 'software' ? (
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">平台：</span>
            <div className="flex gap-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlatformFilter(p.key)}
                  className={
                    'rounded-full border px-2 py-1 transition ' +
                    (platformFilter === p.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent')
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">类别：</span>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={
                    'rounded-full border px-2 py-1 transition whitespace-nowrap ' +
                    (categoryFilter === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent')
                  }
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">更新时间：</span>
            <div className="flex gap-1">
              {TIME_RANGES.map((tr) => (
                <button
                  key={tr.key}
                  type="button"
                  onClick={() => setTimeRange(tr.key)}
                  className={
                    'rounded-full border px-2 py-1 transition ' +
                    (timeRange === tr.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-accent')
                  }
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {query.trim() && (
        <div className="text-sm text-muted-foreground">
          {dict.search?.resultCount?.replace('{count}', String(total)) || `找到 ${total} 个结果`}
        </div>
      )}

      {(activeType === 'all' || activeType === 'software') && filtered.software.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">软件 ({filtered.software.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.software.map((s) => (
              <SoftwareCard key={s.slug} item={s} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {(activeType === 'all' || activeType === 'tutorials') && filtered.tutorials.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">教程 ({filtered.tutorials.length})</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.tutorials.map((t) => (
              <TutorialCard key={t.slug} tutorial={t} lang={lang} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {(activeType === 'all' || activeType === 'ai') && filtered.ai.length > 0 && (
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
        <div className="py-12 text-center text-muted-foreground">
          <p>{dict.search?.empty || '未找到相关结果'}</p>
          <p className="mt-2 text-sm">{dict.search?.tryAnother || '请尝试其他关键词'}</p>
        </div>
      )}

      {!query.trim() && (
        <div className="py-12 text-center text-muted-foreground">
          <p>{dict.search?.hint || '输入关键词开始搜索'}</p>
        </div>
      )}
    </div>
  );
}
