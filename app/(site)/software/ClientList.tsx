"use client";
import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { SoftwareCard } from '@/components/SoftwareCard';
import { textIncludes } from '@/lib/search';

export default function ClientList({ items, dict }: { items: any[]; dict: any }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter((s) => textIncludes(s.name + ' ' + s.description, q));
  }, [items, q]);
  return (
    <div className="space-y-4">
      <SearchInput onChange={setQ} placeholder={dict.search.softwarePlaceholder} />
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <SoftwareCard key={s.slug} item={s} lang={dict.lang} />
        ))}
      </div>
    </div>
  );
}


