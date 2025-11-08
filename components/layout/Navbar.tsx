import Link from 'next/link';
import LangSwitcher from '@/components/LangSwitcher';
import AuthButton from '@/components/AuthButton';
import { getDictionary } from '@/lib/i18n/server';

export default async function Navbar() {
  const { dict } = await getDictionary();
  return (
    <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Software Hub</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/software">{dict.nav.software}</Link>
          <Link href="/tutorials">{dict.nav.tutorials}</Link>
          <Link
            href="/ai"
            className="px-3 h-8 inline-flex items-center gap-1 rounded-full text-sm border transition-colors bg-gradient-to-r from-sky-500/10 to-fuchsia-500/10 hover:from-sky-500/20 hover:to-fuchsia-500/20 border-border text-foreground/80"
          >
            {dict.nav.ai}
          </Link>
          <Link href="/ai/discover">{dict.nav.discover}</Link>
          <Link href="/about">{dict.nav.about}</Link>
          <LangSwitcher />
          <AuthButton labels={dict.auth} />
        </nav>
      </div>
    </header>
  );
}

