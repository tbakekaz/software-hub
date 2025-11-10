// Vercel 支持 cookies()，可以正常使用
import { cookies } from 'next/headers';
import { t, type Lang } from './index';

export async function getCurrentLang(): Promise<Lang> {
  try {
    // 从 cookie 读取语言（middleware 会根据 URL 路径自动设置）
    const cookieStore = await cookies();
    const c = cookieStore.get('lang')?.value as Lang | undefined;
    if (c === 'zh' || c === 'kk' || c === 'ru' || c === 'en') {
      return c;
    }
  } catch (error) {
    // 如果 cookies() 失败，使用默认语言
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
    console.error('Failed to get dictionary:', error);
    return { lang: 'zh' as Lang, dict: t('zh') } as const;
  }
}



