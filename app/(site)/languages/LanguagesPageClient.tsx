'use client';

import { useState } from 'react';
import { LanguageResourceCard } from '@/components/LanguageResourceCard';
import { LanguageTranslator } from '@/components/LanguageTranslator';
import type { LanguageResource } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

interface Props {
  resources: Record<string, LanguageResource[]>;
  dict?: {
    title?: string;
    subtitle?: string;
    empty?: string;
    emptyHint?: string;
    targetLanguage?: Record<string, string>;
    category?: Record<string, string>;
    level?: Record<string, string>;
    resourceType?: Record<string, string>;
    free?: string;
    resources?: string;
  };
  lang: Lang;
}

export function LanguagesPageClient({ resources, dict, lang }: Props) {
  const [selectedTargetLang, setSelectedTargetLang] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // 获取第一个目标语言作为默认
  const firstTargetLang = Object.keys(resources)[0] || 'english';
  // 默认选择第一个语言
  const currentTargetLang = selectedTargetLang || firstTargetLang;

  const targetLanguageLabels = dict?.targetLanguage || {};

  return (
    <main className="container mx-auto px-4 py-8 space-y-8" data-no-translate="false">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{dict?.title || '学习语言'}</h1>
          <p className="text-muted-foreground mt-2">{dict?.subtitle || '精选视频、文档、音频学习材料'}</p>
        </div>
        
        {/* 目标语言选择器 */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium">选择要学习的语言：</span>
          {Object.keys(resources).map((targetLang) => (
            <button
              key={targetLang}
              onClick={() => setSelectedTargetLang(targetLang)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedTargetLang === targetLang
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-accent'
              }`}
            >
              {targetLanguageLabels[targetLang] || targetLang}
            </button>
          ))}
        </div>

        {/* 翻译功能 - 默认显示第一个语言 */}
        {currentTargetLang && (
          <div className="sticky top-20 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-b shadow-sm">
            <LanguageTranslator
              targetLanguage={currentTargetLang as 'english' | 'chinese' | 'kazakh' | 'russian' | 'other'}
              onTranslate={setIsTranslating}
            />
          </div>
        )}
      </header>

      {Object.keys(resources).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>{dict?.empty || '暂无语言学习资源'}</p>
          <p className="text-sm mt-2">{dict?.emptyHint || '请在 content/languages/ 目录添加 JSON 文件'}</p>
        </div>
      ) : (
        <>
          {selectedTargetLang && resources[selectedTargetLang] ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                {targetLanguageLabels[selectedTargetLang] || selectedTargetLang}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources[selectedTargetLang].map((item) => (
                  <LanguageResourceCard key={item.slug} resource={item} lang={lang} dict={dict} />
                ))}
              </div>
            </section>
          ) : (
            Object.entries(resources).map(([targetLang, items]) => (
              <section key={targetLang} className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  {targetLanguageLabels[targetLang] || targetLang}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <LanguageResourceCard key={item.slug} resource={item} lang={lang} dict={dict} />
                  ))}
                </div>
              </section>
            ))
          )}
        </>
      )}
    </main>
  );
}

