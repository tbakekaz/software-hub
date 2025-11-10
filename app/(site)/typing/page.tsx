import { getDictionary } from '@/lib/i18n/server';
import { TypingPracticeClient } from './TypingPracticeClient';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: `打字练习 - ${siteConfig.name}`,
  description: '多语言打字练习，支持哈萨克语、中文、俄语、英语，提升打字速度和准确率',
  alternates: {
    languages: {
      'x-default': '/',
      'zh-KZ': '/zh',
      'kk-KZ': '/kk',
      'ru-RU': '/ru',
      'en': '/en',
    },
  },
};

export default async function TypingPage() {
  const { dict, lang } = await getDictionary();
  
  return <TypingPracticeClient dict={dict.typing || {}} lang={lang} />;
}

