import { cookies } from 'next/headers';
import { t, type Lang } from './index';

export async function getCurrentLang(): Promise<Lang> {
  // 在 Edge Runtime 中，cookies() 可能不稳定，使用 try-catch 包装
  try {
    const cookieStore = await cookies();
    const c = cookieStore.get('lang')?.value as Lang | undefined;
    if (c === 'zh' || c === 'kk' || c === 'ru' || c === 'en') {
      return c;
    }
  } catch (error) {
    // 如果 cookies() 失败（在 Edge Runtime 中可能发生），使用默认语言
    // 不输出错误日志，避免在生产环境中产生噪音
  }
  return 'zh';
}

export async function getDictionary() {
  // 添加完整的错误处理，确保始终返回有效的字典
  try {
    const lang = await getCurrentLang();
    const dict = t(lang);
    return { lang, dict } as const;
  } catch (error) {
    // 如果获取字典失败，使用中文作为回退
    return { lang: 'zh' as Lang, dict: t('zh') } as const;
  }
}



