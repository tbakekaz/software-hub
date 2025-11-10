'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const links = [
  { href: '/zh', label: '中文', lang: 'zh' },
  { href: '/kk', label: 'Қазақша', lang: 'kk' },
  { href: '/ru', label: 'Русский', lang: 'ru' },
  { href: '/en', label: 'English', lang: 'en' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLanguageChange = (lang: string, href: string) => {
    // 设置 cookie
    document.cookie = `lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
    // 跳转到对应语言页面并强制刷新
    window.location.href = href;
  };
  
  return (
    <nav className="flex items-center gap-3 text-sm">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
        return (
          <button
            key={link.href}
            onClick={() => handleLanguageChange(link.lang, link.href)}
            className={isActive ? 'underline font-medium hover:opacity-70' : 'hover:opacity-70'}
          >
            {link.label}
          </button>
        );
      })}
    </nav>
  );
}

