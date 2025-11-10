'use client';

import { useState, useEffect } from 'react';
import { pickLocaleString } from '@/lib/i18n/translate';
import { completeCourse, getCourseCompletion } from '@/lib/learning-progress';
import { CourseCompletionModal } from '@/components/CourseCompletionModal';
import { FocusModeTrigger } from '@/components/FocusModeTrigger';
import type { LanguageResource } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

interface Props {
  resource: LanguageResource;
  lang: Lang;
  dict: any;
}

export function LanguageResourceDetailClient({ resource, lang, dict }: Props) {
  const [completedResources, setCompletedResources] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState<{
    stars: 1 | 2 | 3;
    experienceGained: number;
    newAchievements: string[];
  } | null>(null);
  const [existingCompletion, setExistingCompletion] = useState(getCourseCompletion(resource.slug));

  const categoryLabels = dict.languages?.category || {};
  const levelLabels = dict.languages?.level || {};
  const targetLanguageLabels = dict.languages?.targetLanguage || {};
  const resourceTypeLabels = dict.languages?.resourceType || {};

  // 从 localStorage 读取已完成的资源
  useEffect(() => {
    const stored = localStorage.getItem(`completed_resources_${resource.slug}`);
    if (stored) {
      try {
        setCompletedResources(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, [resource.slug]);

  // 标记资源为已完成
  const markResourceComplete = (index: number) => {
    const newCompleted = new Set(completedResources);
    newCompleted.add(index);
    setCompletedResources(newCompleted);
    localStorage.setItem(`completed_resources_${resource.slug}`, JSON.stringify(Array.from(newCompleted)));
  };

  // 检查所有资源是否完成
  const checkAllResourcesCompleted = (): boolean => {
    return completedResources.size === resource.resources.length;
  };

  // 计算星星
  const calculateStars = (): 1 | 2 | 3 => {
    if (!checkAllResourcesCompleted()) return 1;
    // 简化：完成所有资源 = 2星，如果有测试通过 = 3星
    return 2;
  };

  // 获取学习时长（简化：假设每个资源10分钟）
  const getTimeSpent = (): number => {
    return completedResources.size * 10;
  };

  // 完成课程
  const handleComplete = () => {
    if (!checkAllResourcesCompleted()) {
      alert('请先完成所有学习资源');
      return;
    }

    const stars = calculateStars();
    const timeSpent = getTimeSpent();

    const result = completeCourse(resource, stars, timeSpent, completedResources.size);
    setCompletionData({
      stars,
      experienceGained: result.experienceGained,
      newAchievements: result.newAchievements
    });
    setExistingCompletion(result.stats.completedCourses.find(c => c.resourceSlug === resource.slug) || null);
    setShowCompletionModal(true);
  };

  // 按类型分组资源
  const groupedResources = resource.resources.reduce((acc, res, idx) => {
    const type = res.type === 'pdf' ? 'document' : res.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push({ ...res, index: idx });
    return acc;
  }, {} as Record<string, Array<typeof resource.resources[0] & { index: number }>>);

  // 资源类型配置
  const resourceTypeConfig = {
    video: {
      icon: '🎥',
      label: '视频资料',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-900/50',
      order: 1,
      actionLabel: '观看视频'
    },
    document: {
      icon: '📄',
      label: '文档资料',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900/50',
      order: 2,
      actionLabel: '查看文档'
    },
    audio: {
      icon: '🎵',
      label: '音频资料',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-900/50',
      order: 3,
      actionLabel: '播放音频'
    }
  };

  const title = pickLocaleString(resource.title_i18n || resource.title, lang);
  const description = pickLocaleString(resource.description_i18n || resource.description, lang);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{dict.languages?.learningResources || '学习资源'}</h2>
          <button
            onClick={() => {
              const allUrls = resource.resources.map(r => r.url).join('\n');
              navigator.clipboard.writeText(allUrls).then(() => {
                alert('所有资源链接已复制到剪贴板');
              });
            }}
            className="text-sm text-primary hover:underline"
          >
            📥 复制全部链接
          </button>
        </div>

        {Object.entries(groupedResources)
          .sort(([a], [b]) => {
            const orderA = resourceTypeConfig[a as keyof typeof resourceTypeConfig]?.order || 999;
            const orderB = resourceTypeConfig[b as keyof typeof resourceTypeConfig]?.order || 999;
            return orderA - orderB;
          })
          .map(([type, resources]) => {
            const config = resourceTypeConfig[type as keyof typeof resourceTypeConfig];
            if (!config) return null;

            return (
              <section key={type} className="space-y-3">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${config.color}`}>
                  <span>{config.icon}</span>
                  {config.label}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({resources.length} 个)
                  </span>
                </h3>

                <div className={`rounded-lg p-4 ${config.bgColor} space-y-3`}>
                  {resources.map((res) => {
                    const resTitle = pickLocaleString(res.title_i18n || res.title, lang);
                    const isCompleted = completedResources.has(res.index);

                    return (
                      <div
                        key={res.index}
                        className={`border rounded-lg p-4 bg-background hover:shadow-md transition-all ${config.borderColor} ${
                          isCompleted ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{resTitle}</h4>
                              {isCompleted && <span className="text-green-600">✅</span>}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {res.duration && (
                                <span className="flex items-center gap-1">
                                  ⏱️ {res.duration}
                                </span>
                              )}
                              {res.size && (
                                <span className="flex items-center gap-1">
                                  📦 {res.size}
                                </span>
                              )}
                              {res.format && (
                                <span className="px-2 py-1 rounded bg-muted text-xs">
                                  {res.format.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markResourceComplete(res.index)}
                            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                              type === 'video'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : type === 'audio'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {type === 'video' && '▶️ '}
                            {type === 'audio' && '🔊 '}
                            {config.actionLabel}
                          </a>
                          <a
                            href={res.url}
                            download
                            className="inline-flex items-center px-3 py-2 rounded-lg border hover:bg-muted transition-colors"
                          >
                            📥 下载
                          </a>
                          <button
                            onClick={() => markResourceComplete(res.index)}
                            className={`px-3 py-2 rounded-lg border transition-colors ${
                              isCompleted
                                ? 'bg-green-100 border-green-300 text-green-700'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {isCompleted ? '✅ 已完成' : '标记完成'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </div>

      {/* 完成按钮 */}
      <div className="sticky bottom-4 z-40 mt-8">
        <button
          onClick={handleComplete}
          disabled={!checkAllResourcesCompleted()}
          className={`w-full px-6 py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${
            checkAllResourcesCompleted()
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {checkAllResourcesCompleted() ? (
            '✅ 完成课程'
          ) : (
            `完成所有资源 (${completedResources.size}/${resource.resources.length})`
          )}
        </button>
      </div>

      {/* 专注模式浮动按钮 */}
      <FocusModeTrigger variant="floating" />

      {/* 完成弹窗 */}
      {showCompletionModal && completionData && (
        <CourseCompletionModal
          stars={completionData.stars}
          newAchievements={completionData.newAchievements}
          experienceGained={completionData.experienceGained}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </>
  );
}

