"use client";
import { pickLocaleString } from '@/lib/i18n/translate';
import type { Lang } from '@/lib/i18n';
import { isFavorite, toggleFavorite } from '@/lib/fav';
import { useEffect, useState } from 'react';

export function AIItemCard({ item, lang }: { item: { name: string; name_i18n?: any; url: string; description: string; description_i18n?: any; icon: string; locale?: string[] }; lang: Lang }) {
  const [fav, setFav] = useState(false);
  useEffect(() => { setFav(isFavorite(item.name)); }, [item.name]);
  const name = pickLocaleString(item.name_i18n || item.name, lang);
  const desc = pickLocaleString(item.description_i18n || item.description, lang);
  return (
    <a href={item.url} rel="noopener" className="relative border rounded p-4 block hover:bg-accent">
      <div className="flex items-center justify-between">
        <div className="text-2xl">{item.icon}</div>
        <div className="flex gap-1">
          {item.locale?.includes('kk') && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]">kk</span>
          )}
          {item.locale?.includes('ru') && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]">ru</span>
          )}
          {item.locale?.includes('en') && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]">en</span>
          )}
        </div>
      </div>
      <div className="font-medium underline mt-2 flex items-center justify-between">
        <span>{name}</span>
        <button type="button" className="text-xs border rounded px-2 py-0.5" onClick={(e)=>{e.preventDefault(); setFav(toggleFavorite(item.name).includes(item.name));}}>
          {fav ? '★' : '☆'}
        </button>
      </div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </a>
  );
}


