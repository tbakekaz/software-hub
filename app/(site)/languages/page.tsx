import { getAllLanguageResources } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import { LanguagesPageClient } from './LanguagesPageClient';
import type { LanguageResource } from '@/lib/content-edge';

export default async function LanguagesPage() {
  const { dict, lang } = await getDictionary();
  const resources = getAllLanguageResources();
  
  // 按目标语言分组
  const byTargetLanguage = resources.reduce((acc, item) => {
    if (!acc[item.targetLanguage]) acc[item.targetLanguage] = [];
    acc[item.targetLanguage].push(item);
    return acc;
  }, {} as Record<string, LanguageResource[]>);

  return (
    <LanguagesPageClient 
      resources={byTargetLanguage} 
      dict={dict.languages} 
      lang={lang}
    />
  );
}
