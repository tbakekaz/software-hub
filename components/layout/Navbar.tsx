import { getDictionary } from '@/lib/i18n/server';
import { NavbarClient } from './NavbarClient';

// 禁用缓存，确保每次请求都获取最新的语言设置
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Navbar() {
  const { dict, lang } = await getDictionary();
  return <NavbarClient dict={dict} lang={lang} searchPlaceholder={dict.nav.searchPlaceholder || '搜索软件、教程、AI 工具...'} />;
}

