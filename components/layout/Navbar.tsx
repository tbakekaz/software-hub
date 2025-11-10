import { getDictionary } from '@/lib/i18n/server';
import { NavbarClient } from './NavbarClient';

export default async function Navbar() {
  const { dict } = await getDictionary();
  return <NavbarClient dict={dict} searchPlaceholder={dict.nav.searchPlaceholder || '搜索软件、教程、AI 工具...'} />;
}

