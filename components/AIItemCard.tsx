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
  
  // 智能描述翻译：优先使用 description_i18n，如果没有则根据 locale 和 description 语言智能选择
  let desc: string;
  if (item.description_i18n) {
    desc = pickLocaleString(item.description_i18n, lang);
  } else {
    const locales = item.locale || [];
    const isChinese = /[\u4e00-\u9fa5]/.test(item.description);
    const isEnglish = /^[a-zA-Z\s.,!?;:'"()-]+$/.test(item.description.trim());
    
    // 如果当前语言在 locale 中，优先使用 description
    if (locales.includes(lang)) {
      desc = item.description;
    } 
    // 如果 description 是中文，但当前语言不是中文，且 locale 包含其他语言，优先显示英文
    else if (isChinese && locales.includes('en') && lang !== 'zh') {
      // 对于中文描述但没有英文翻译的情况，显示一个提示或保持原样
      // 这里可以后续添加自动翻译或手动翻译
      desc = item.description; // 暂时保持原样，后续可以添加翻译
    }
    // 如果 description 是英文，直接使用
    else if (isEnglish) {
      desc = item.description;
    }
    // 其他情况使用原 description
    else {
      desc = item.description;
    }
  }
  
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


