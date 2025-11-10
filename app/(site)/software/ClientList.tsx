"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import type { Software } from '@/lib/content-edge';
import { SearchInput } from '@/components/SearchInput';
import { SoftwareCard } from '@/components/SoftwareCard';
import { SkeletonGrid } from '@/components/SkeletonGrid';
import { MonetizeSlot } from '@/components/MonetizeSlot';
import { textIncludes } from '@/lib/search';
import { loadSoftwarePage, softwareManifest } from '@/lib/generated/software/loader';

const LOAD_ERROR_FALLBACK = '加载失败，请稍后再试';

type Props = {
  initialItems: ReadonlyArray<Software>;
  manifest: typeof softwareManifest;
  dict: any;
  lang: Lang;
};

export default function ClientList({ initialItems, manifest, dict, lang }: Props) {
  const categories = useMemo(() => ['all', ...(manifest.categories || [])], [manifest.categories]);
  const [items, setItems] = useState<ReadonlyArray<Software>>(initialItems);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedPages = useRef(new Set<number>([0]));

  const loadPages = useCallback(async (indices: number[]) => {
    const targets = indices.filter((idx) => idx >= 0 && idx < manifest.pageCount && !loadedPages.current.has(idx));
    if (!targets.length) return;
    setLoading(true);
    setError(null);
    try {
      const pages = await Promise.all(targets.map((idx) => loadSoftwarePage(idx)));
      loadedPages.current = new Set([...loadedPages.current, ...targets]);
      setItems((prev) => {
        const merged = [...prev];
        pages.forEach((page) => {
          const pageItems = page as unknown as Software[];
          pageItems.forEach((software) => {
            if (!merged.some((existing) => existing.slug === software.slug)) {
              merged.push(software);
            }
          });
        });
        return merged;
      });
    } catch (err) {
      console.error('[ClientList] loadPages error', err);
      setError(dict.search?.loadError || LOAD_ERROR_FALLBACK);
    } finally {
      setLoading(false);
    }
  }, [dict.search?.loadError, manifest.pageCount]);

  const loadAllRemaining = useCallback(async () => {
    if (loadedPages.current.size === manifest.pageCount) return;
    const remaining = Array.from({ length: manifest.pageCount }, (_, idx) => idx);
    await loadPages(remaining);
  }, [loadPages, manifest.pageCount]);

  useEffect(() => {
    if (!query.trim()) return;
    void loadAllRemaining();
  }, [query, loadAllRemaining]);

  useEffect(() => {
    if (activeCategory === 'all') return;
    void loadAllRemaining();
  }, [activeCategory, loadAllRemaining]);

  const filtered = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? items
      : items.filter((software) => {
          const name = software.category?.toLowerCase() || '';
          const localized = typeof software.category_i18n === 'object'
            ? Object.values(software.category_i18n).join(' ').toLowerCase()
            : '';
          return name.includes(activeCategory.toLowerCase()) || localized.includes(activeCategory.toLowerCase());
        });

    if (!query.trim()) return byCategory;
    const keyword = query.trim();
    return byCategory.filter((software) =>
      textIncludes(
        [software.name, software.description, software.category, software.platforms?.join(' ') || ''].join(' '),
        keyword,
      ),
    );
  }, [items, query, activeCategory]);

  const hasMore = loadedPages.current.size < manifest.pageCount;

  const loadedLabel = dict.search?.loadedCount
    ? dict.search.loadedCount.replace('{count}', String(items.length)).replace('{total}', String(manifest.total))
    : `已加载 ${items.length} / ${manifest.total}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchInput onChange={setQuery} placeholder={dict.search.softwarePlaceholder} />
        </div>
        <div className="text-sm text-muted-foreground">{loadedLabel}</div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm" aria-label="软件分类筛选">
        {categories.map((cate) => (
          <button
            key={cate}
            type="button"
            onClick={() => setActiveCategory(cate)}
            className={
              'rounded-full border px-3 py-1 transition ' +
              (activeCategory === cate ? 'bg-foreground text-background' : 'bg-background hover:bg-accent hover:text-accent-foreground')
            }
          >
            {cate === 'all' ? '全部' : cate}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading && !items.length ? <SkeletonGrid count={manifest.pageSize} /> : null}

      {filtered.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          {dict.search.noSoftware || '暂无匹配的软件'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((software) => (
            <SoftwareCard key={software.slug} item={software} lang={lang} />
          ))}
        </div>
      )}

      <MonetizeSlot position="home-between-sections" />

      {hasMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              const candidates = Array.from({ length: manifest.pageCount }, (_, idx) => idx);
              const next = candidates.find((idx) => !loadedPages.current.has(idx));
              if (typeof next === 'number') {
                void loadPages([next]);
              }
            }}
            disabled={loading}
            className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? dict.search.loading || '加载中…' : dict.search.loadMore || '加载更多'}
          </button>
        </div>
      ) : null}
    </div>
  );
}


