import { cookies } from 'next/headers';
import { t, type Lang } from './index';

export async function getCurrentLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const c = cookieStore.get('lang')?.value as Lang | undefined;
  if (c === 'zh' || c === 'kk' || c === 'ru' || c === 'en') return c;
  return 'zh';
}

export async function getDictionary() {
  const lang = await getCurrentLang();
  return { lang, dict: t(lang) } as const;
}



