"use client";
import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { AIItemCard } from '@/components/AIItemCard';

type Category = { key: string; name: string };

type Labels = {
  categories: { key: string; name: string }[];
  searchPlaceholder: string;
  empty: string;
  langFilter: { all: string; kk: string; ru: string; en: string };
};

export default function DiscoverClient({ items, lang, labels }: { items: any[]; lang: any; labels: Labels }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState<string>(labels.categories[0]?.key || '对话');
  const [langFilter, setLangFilter] = useState<'all' | 'kk' | 'ru' | 'en'>('all');
  const filtered = useMemo(() => {
    const intl = items
      .filter((i) => i.isInternational && (i.locale?.includes('en') || i.locale?.includes('ru')))
      .sort((a, b) => (b.locale?.includes('kk') ? 1 : 0) - (a.locale?.includes('kk') ? 1 : 0));
    const byLang =
      langFilter === 'all' ? intl : intl.filter((i) => i.locale?.includes(langFilter));
    const byCat = byLang.filter((i) => (i.category || '').includes(active));
    if (!q) return byCat;
    const lowercase = q.toLowerCase();
    return byCat.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(lowercase));
  }, [items, active, q, langFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar text-sm">
          {(labels.categories as Category[]).map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={
                'px-3 py-1 rounded-full border ' +
                (active === c.key ? 'bg-foreground text-background' : 'bg-background hover:bg-accent')
              }
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-1 text-xs">
            {(['all','kk','ru','en'] as const).map((lf) => (
              <button
                key={lf}
                onClick={() => setLangFilter(lf)}
                className={
                  'px-2 py-1 rounded-full border ' +
                  (langFilter === lf ? 'bg-foreground text-background' : 'bg-background hover:bg-accent')
                }
              >
                {labels.langFilter[lf]}
              </button>
            ))}
          </div>
          <div className="w-64">
            <SearchInput placeholder={labels.searchPlaceholder} onChange={setQ} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((i) => (
          <AIItemCard key={i.name} item={i} lang={lang} />
        ))}
        {!filtered.length && (
          <div className="col-span-full text-sm text-muted-foreground">{labels.empty}</div>
        )}
      </div>
    </div>
  );
}


