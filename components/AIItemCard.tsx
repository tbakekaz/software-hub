"use client";
import { useEffect, useState } from 'react';
import { CardBase, CardHeader, CardBody, CardBadge, CardMeta } from '@/components/CardBase';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { Lang } from '@/lib/i18n';
import { isFavorite, toggleFavorite } from '@/lib/fav';

export function AIItemCard({ item, lang }: { item: { name: string; name_i18n?: any; url: string; description: string; description_i18n?: any; icon: string; locale?: string[] }; lang: Lang }) {
  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(isFavorite(item.name));
  }, [item.name]);
  const name = pickLocaleString(item.name_i18n || item.name, lang);
  const desc = pickLocaleString(item.description_i18n || item.description, lang);
  const locales = item.locale ?? [];

  return (
    <CardBase href={item.url} target="_blank" rel="noopener" className="group" compact>
      <CardHeader className="items-start">
        <div className="flex items-center gap-3">
          <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform" aria-hidden>
            {item.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </div>
            {locales.length > 0 && (
              <CardMeta className="mt-1 gap-1">
                {locales.map((code) => (
                  <CardBadge key={code} className="uppercase tracking-wide">
                    {code}
                  </CardBadge>
                ))}
              </CardMeta>
            )}
          </div>
        </div>
        <button
          type="button"
          className="text-xs border rounded-full px-2 py-0.5 hover:bg-primary/10 hover:border-primary/50 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            const favorites = toggleFavorite(item.name);
            setFav(favorites.includes(item.name));
          }}
          aria-label={fav ? '取消收藏' : '收藏'}
        >
          {fav ? '★' : '☆'}
        </button>
      </CardHeader>
      <CardBody>
        <p className="line-clamp-3 leading-relaxed">{desc}</p>
      </CardBody>
    </CardBase>
  );
}


