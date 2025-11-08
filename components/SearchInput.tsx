"use client";
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/search';
import { useMemo } from 'react';

export function SearchInput({ onChange, placeholder }: { onChange: (v: string) => void; placeholder?: string }) {
  const debounced = useMemo(() => debounce(onChange, 300), [onChange]);
  return <Input placeholder={placeholder || '搜索'} onChange={(e) => debounced(e.target.value)} />;
}




