import type { Lang } from './index';

type LocaleString = string | { zh?: string; kk?: string; ru?: string; en?: string } | undefined | null;

export function pickLocaleString(input: LocaleString, lang: Lang): string {
  if (input == null) return '';
  if (typeof input === 'string') return input;
  const table = input as Record<string, string | undefined>;
  
  // 优先使用当前语言的翻译
  if (table[lang] && table[lang]!.trim()) {
    return table[lang]!;
  }
  
  // 回退顺序：英文 > 俄文 > 哈萨克文 > 中文
  if (table.en && table.en.trim()) return table.en;
  if (table.ru && table.ru.trim()) return table.ru;
  if (table.kk && table.kk.trim()) return table.kk;
  if (table.zh && table.zh.trim()) return table.zh;
  
  return '';
}



