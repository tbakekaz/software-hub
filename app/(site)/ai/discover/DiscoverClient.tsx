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

// 分类映射：英文key -> 中文分类名
const CATEGORY_MAP: Record<string, string> = {
  chat: '对话',
  image: '图像',
  video: '视频',
  office: '办公',
  audio: '音频',
  dev: '开发',
  paper: '论文',
  search: '搜索',
  model: '模型',
};

export default function DiscoverClient({ items, lang, labels }: { items: any[]; lang: any; labels: Labels }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState<string>(labels.categories[0]?.key || 'chat');
  const [langFilter, setLangFilter] = useState<'all' | 'kk' | 'ru' | 'en'>('all');
  
  const filtered = useMemo(() => {
    // 获取当前分类的中文名称
    const categoryName = CATEGORY_MAP[active] || active;
    
    // 先按分类筛选
    let byCat = items.filter((i) => {
      const itemCategory = i.category || '';
      return itemCategory === categoryName || itemCategory === active;
    });
    
    // 按语言筛选
    const byLang = langFilter === 'all' 
      ? byCat 
      : byCat.filter((i) => {
          const locales = i.locale || [];
          return Array.isArray(locales) ? locales.includes(langFilter) : false;
        });
    
    // 按搜索关键词筛选
    if (q) {
      const lowercase = q.toLowerCase();
      return byLang.filter((i) => {
        const name = i.name || '';
        const description = i.description || '';
        const tags = (i.tags || []).join(' ');
        return `${name} ${description} ${tags}`.toLowerCase().includes(lowercase);
      });
    }
    
    return byLang;
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


