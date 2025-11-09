// 注意：在 Edge Runtime 中，cookies() 会触发 async_hooks，所以暂时不使用
// import { cookies } from 'next/headers';
import { t, type Lang } from './index';

export async function getCurrentLang(): Promise<Lang> {
  // 在 Edge Runtime 中，cookies() 会触发 async_hooks 错误
  // 暂时禁用 cookies 功能，直接返回默认语言
  // TODO: 找到在 Edge Runtime 中安全使用 cookies 的方法
  return 'zh';
  
  // 之前的代码（已禁用）：
  // try {
  //   const cookieStore = await cookies();
  //   const c = cookieStore.get('lang')?.value as Lang | undefined;
  //   if (c === 'zh' || c === 'kk' || c === 'ru' || c === 'en') {
  //     return c;
  //   }
  // } catch (error) {
  //   // 如果 cookies() 失败（在 Edge Runtime 中可能发生），使用默认语言
  // }
  // return 'zh';
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



