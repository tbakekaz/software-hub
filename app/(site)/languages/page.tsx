import { getAllLanguageResources } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import { LanguageResourceCard } from '@/components/LanguageResourceCard';
import type { LanguageResource } from '@/lib/content-edge';
import { pickLocaleString } from '@/lib/i18n/translate';

export default async function LanguagesPage() {
  const { dict, lang } = await getDictionary();
  const resources = getAllLanguageResources();
  
  // 按目标语言分组
  const byTargetLanguage = resources.reduce((acc, item) => {
    if (!acc[item.targetLanguage]) acc[item.targetLanguage] = [];
    acc[item.targetLanguage].push(item);
    return acc;
  }, {} as Record<string, LanguageResource[]>);

  const targetLanguageLabels = dict.languages?.targetLanguage || {};

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{dict.languages?.title || '学习语言'}</h1>
        <p className="text-muted-foreground">{dict.languages?.subtitle || '精选视频、文档、音频学习材料'}</p>
      </header>

      {Object.keys(byTargetLanguage).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>{dict.languages?.empty || '暂无语言学习资源'}</p>
          <p className="text-sm mt-2">{dict.languages?.emptyHint || '请在 content/languages/ 目录添加 JSON 文件'}</p>
        </div>
      ) : (
        Object.entries(byTargetLanguage).map(([targetLang, items]) => (
          <section key={targetLang} className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {targetLanguageLabels[targetLang as keyof typeof targetLanguageLabels] || targetLang}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <LanguageResourceCard key={item.slug} resource={item} lang={lang} dict={dict.languages} />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
