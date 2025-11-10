'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/zh', label: '中文' },
  { href: '/kk', label: 'Қазақша' },
  { href: '/ru', label: 'Русский' },
  { href: '/en', label: 'English' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  
  return (
    <nav className="flex items-center gap-3 text-sm">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
        return (
          <Link
            key={link.href}
            href={link.href}
            className={isActive ? 'underline font-medium' : 'hover:opacity-70'}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

