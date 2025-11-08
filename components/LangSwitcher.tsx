"use client";
import { useEffect, useState } from 'react';

const langs = ['zh', 'kk', 'ru', 'en'] as const;

export default function LangSwitcher() {
  const [lang, setLang] = useState<string>('zh');
  useEffect(() => {
    const fromCookie = document.cookie.match(/lang=([^;]+)/)?.[1];
    if (fromCookie) setLang(fromCookie);
  }, []);
  function apply(l: string) {
    document.cookie = `lang=${l};path=/;max-age=31536000`;
    setLang(l);
    location.reload();
  }
  return (
    <select value={lang} onChange={(e) => apply(e.target.value)} className="border rounded h-8 px-2 text-sm bg-background">
      {langs.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  );
}




