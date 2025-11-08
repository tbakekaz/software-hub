import { cookies } from 'next/headers';
import { t, type Lang } from './index';

export async function getCurrentLang(): Promise<Lang> {
  try {
    const cookieStore = await cookies();
    const c = cookieStore.get('lang')?.value as Lang | undefined;
    if (c === 'zh' || c === 'kk' || c === 'ru' || c === 'en') return c;
  } catch (error) {
    // 如果 cookies() 失败，使用默认语言
    console.error('[i18n] Failed to get cookies:', error);
  }
  return 'zh';
}

export async function getDictionary() {
  try {
    const lang = await getCurrentLang();
    return { lang, dict: t(lang) } as const;
  } catch (error) {
    // 如果获取字典失败，使用中文作为回退
    console.error('[i18n] Failed to get dictionary:', error);
    return { lang: 'zh' as Lang, dict: t('zh') } as const;
  }
}



