"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { GlobalTranslator } from '@/components/GlobalTranslator';
import AuthButton from '@/components/AuthButton';

export function NavbarClient({
  dict,
  lang,
  searchPlaceholder
}: {
  dict: any;
  lang?: string;
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const current = window.scrollY;
      setIsScrolled(current > 24);
      setIsHidden(current > lastScrollY && current > 120);
      lastScrollY = current;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    setMobileMenuOpen(false);
  }, [pathname, mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 确保字典存在，提供默认值
  const navDict = dict?.nav || {};
  
  const navLinks = [
    { href: '/software', label: navDict.software || '软件' },
    { href: '/tutorials', label: navDict.tutorials || '教程' },
    {
      href: '/languages',
      label: navDict.languages || '学习语言',
      className:
        'px-3 h-8 inline-flex items-center gap-1 rounded-full text-sm border transition-colors bg-gradient-to-r from-emerald-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:to-blue-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium'
    },
    {
      href: '/ai',
      label: navDict.ai || 'AI 导航',
      className:
        'px-3 h-8 inline-flex items-center gap-1 rounded-full text-sm border transition-colors bg-gradient-to-r from-sky-500/10 to-fuchsia-500/10 hover:from-sky-500/20 hover:to-fuchsia-500/20 border-border text-foreground/80'
    },
    { href: '/ai/discover', label: navDict.discover || '发现' },
    { href: '/about', label: navDict.about || '关于' }
  ];

  return (
    <header
      className={clsx(
        'border-b sticky top-0 z-40 bg-background/80 backdrop-blur transition-transform duration-300',
        isHidden ? '-translate-y-full' : 'translate-y-0',
        isScrolled ? 'shadow-sm' : ''
      )}
    >
      <div
        className={clsx(
          'container mx-auto px-4 flex items-center justify-between gap-3 transition-[height,padding] duration-300',
          isScrolled ? 'h-14 py-2' : 'h-[4.5rem] py-3'
        )}
      >
        <Link href="/" className="font-semibold text-lg tracking-tight">
          {lang === 'zh' ? '软件中心' : lang === 'kk' ? 'Бағдарлама орталығы' : lang === 'ru' ? 'Центр программ' : 'Software Hub'}
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <GlobalTranslator />
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder={searchPlaceholder || '搜索...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-52 h-9 text-sm"
            />
          </form>
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className={clsx('hover:text-primary transition-colors', item.className)}>
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <AuthButton labels={dict.auth} />
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2 rounded-md border border-transparent hover:border-border transition"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="菜单"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      <div
        className={clsx(
          'md:hidden border-t bg-background/95 backdrop-blur transition-[max-height] duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-[420px]' : 'max-h-0'
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder={searchPlaceholder || '搜索...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </form>
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="block py-2 text-base" onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <GlobalTranslator />
            <LanguageSwitcher />
            <AuthButton labels={dict.auth} />
          </div>
        </div>
      </div>
    </header>
  );
}
