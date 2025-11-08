import zh from './zh';
import kk from './kk';
import ru from './ru';
import en from './en';

export type Lang = 'zh' | 'kk' | 'ru' | 'en';
const dict = { zh, kk, ru, en } as const;

export function t(lang: Lang) {
  return dict[lang] || dict.zh;
}




