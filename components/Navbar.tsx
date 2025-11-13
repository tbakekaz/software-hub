import Link from 'next/link';
import { Logo } from './Logo';
import { getDictionary } from '@/lib/i18n/server';

export async function Navbar() {
  let dict: any;
  let lang: string;
  
  try {
    const result = await getDictionary();
    dict = result.dict;
    lang = result.lang;
  } catch (error) {
    dict = {};
    lang = 'en';
  }
  
  const navLinks = [
    { href: '/ai', label: dict.nav?.ai || 'AI Tools' },
    { href: '/languages', label: dict.nav?.languages || 'Language Hub' },
    { href: '#exchange-rates', label: dict.rates?.title || 'Exchange Rates' },
    { href: '/tutorials', label: dict.nav?.tutorials || 'Blog' },
    { href: '/about', label: dict.nav?.about || 'About Us' },
  ];

  const logInText = lang === 'zh' ? '登录' : lang === 'kk' ? 'Кіру' : lang === 'ru' ? 'Войти' : 'Log In';
  const signUpText = lang === 'zh' ? '注册' : lang === 'kk' ? 'Тіркелу' : lang === 'ru' ? 'Регистрация' : 'Sign Up';

  return (
    <header className="flex items-center justify-between whitespace-nowrap py-4 border-b border-solid border-black/10 dark:border-white/10 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="text-primary">
          <Logo />
        </div>
        <h2 className="text-[#111618] dark:text-white text-xl font-bold">KazSoft</h2>
      </Link>
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-[#111618] dark:text-white text-sm font-bold gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-lg">language</span>
          <span className="uppercase">{lang}</span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </button>
        <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 text-[#111618] dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="truncate">{logInText}</span>
        </button>
        <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity hover:scale-105">
          <span className="truncate">{signUpText}</span>
        </button>
      </div>
    </header>
  );
}

