"use client";
import { useEffect, useMemo, useState } from 'react';
import { getFavorites } from '@/lib/fav';
import { AIItemCard } from '@/components/AIItemCard';

export default function FavoritesClient({ items, lang }: { items: any[]; lang: any }) {
  const [fav, setFav] = useState<string[]>([]);
  useEffect(() => { setFav(getFavorites()); }, []);
  const list = useMemo(() => items.filter(i => fav.includes(i.name)), [fav, items]);
  return (
      <div className="grid md:grid-cols-3 gap-4">
        {list.map((i) => (
          <AIItemCard key={i.name} item={i} lang={lang} />
        ))}
      {!list.length && <div className="text-sm text-muted-foreground">{lang === 'zh' ? '还没有收藏任何站点' : lang === 'ru' ? 'Пока пусто.' : lang === 'kk' ? 'Әзірге бос.' : 'No favorites yet.'}</div>}
    </div>
  );
}


