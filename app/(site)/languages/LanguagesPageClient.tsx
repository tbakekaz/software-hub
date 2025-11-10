'use client';

import { useState, useEffect, useMemo } from 'react';
import { LanguageResourceCard } from '@/components/LanguageResourceCard';
import { LanguageTranslator } from '@/components/LanguageTranslator';
import { FocusModeTrigger } from '@/components/FocusModeTrigger';
import { getLearningStats } from '@/lib/learning-progress';
import { pickLocaleString } from '@/lib/i18n/translate';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [recentLearning, setRecentLearning] = useState<LanguageResource | null>(null);

  // 获取第一个目标语言作为默认
  const firstTargetLang = Object.keys(resources)[0] || 'english';
  // 默认选择第一个语言
  const currentTargetLang = selectedTargetLang || firstTargetLang;

  const targetLanguageLabels = dict?.targetLanguage || {};

  // 获取最近学习记录
  useEffect(() => {
    const stats = getLearningStats();
    if (stats.completedCourses.length > 0) {
      const recent = stats.completedCourses
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
      // 从所有资源中查找
      const allResources = Object.values(resources).flat();
      const resource = allResources.find(r => r.slug === recent.resourceSlug);
      if (resource) {
        setRecentLearning(resource);
      }
    }
  }, [resources]);

  // 筛选资源
  const filteredResources = useMemo(() => {
    const currentResources = selectedTargetLang && resources[selectedTargetLang]
      ? resources[selectedTargetLang]
      : Object.values(resources).flat();

    return currentResources.filter((item) => {
      // 搜索筛选
      if (searchQuery) {
        const title = pickLocaleString(item.title_i18n || item.title, lang);
        const desc = pickLocaleString(item.description_i18n || item.description, lang);
        const query = searchQuery.toLowerCase();
        if (!title.toLowerCase().includes(query) && !desc.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 难度筛选
      if (levelFilter && item.level !== levelFilter) {
        return false;
      }

      // 类别筛选
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [selectedTargetLang, resources, searchQuery, levelFilter, categoryFilter, lang]);

  return (
    <main className="container mx-auto px-4 py-8 space-y-8" data-no-translate="false">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{dict?.title || '学习语言'}</h1>
            <p className="text-muted-foreground mt-2">{dict?.subtitle || '精选视频、文档、音频学习材料'}</p>
          </div>
          <FocusModeTrigger />
        </div>

        {/* 继续学习 */}
        {recentLearning && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">继续学习</p>
                <h3 className="font-semibold">{pickLocaleString(recentLearning.title_i18n || recentLearning.title, lang)}</h3>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <a
                href={`/languages/${recentLearning.slug}`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                继续 →
              </a>
            </div>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <input
            type="text"
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg bg-background"
          />

          <select
            value={levelFilter || ''}
            onChange={(e) => setLevelFilter(e.target.value || null)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="">全部难度</option>
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>

          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="">全部分类</option>
            <option value="grammar">语法</option>
            <option value="vocabulary">词汇</option>
            <option value="listening">听力</option>
            <option value="speaking">口语</option>
            <option value="reading">阅读</option>
            <option value="writing">写作</option>
            <option value="course">课程</option>
          </select>
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
          {filteredResources.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                {selectedTargetLang
                  ? targetLanguageLabels[selectedTargetLang] || selectedTargetLang
                  : '所有课程'}
                <span className="text-base font-normal text-muted-foreground ml-2">
                  ({filteredResources.length} 个)
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((item) => (
                  <LanguageResourceCard key={item.slug} resource={item} lang={lang} dict={dict} />
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>没有找到匹配的课程</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}

