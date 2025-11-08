"use client";
import { useEffect, useMemo, useState } from 'react';
import { AIItemCard } from '@/components/AIItemCard';

type Item = { name: string; name_i18n?: any; url: string; description: string; description_i18n?: any; icon: string };

export default function AIClient({ items, lang }: { items: Item[]; lang?: any }) {
  const [clicks, setClicks] = useState<Record<string, number>>({});
  useEffect(() => {
    const saved = localStorage.getItem('ai_clicks');
    if (saved) setClicks(JSON.parse(saved));
  }, []);
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (clicks[b.name] || 0) - (clicks[a.name] || 0));
  }, [items, clicks]);
  function onClick(name: string) {
    const next = { ...clicks, [name]: (clicks[name] || 0) + 1 };
    setClicks(next);
    localStorage.setItem('ai_clicks', JSON.stringify(next));
  }
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {sorted.map((i) => (
        <div key={i.name} onClick={() => onClick(i.name)}>
          <AIItemCard item={i} lang={lang} />
        </div>
      ))}
    </div>
  );
}


