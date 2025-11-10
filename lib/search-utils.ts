// 搜索工具函数：同义词映射、拼写容错、筛选

// 同义词映射表
const SYNONYMS: Record<string, string[]> = {
  ps: ['photoshop', 'adobe photoshop'],
  pr: ['premiere', 'premiere pro', 'adobe premiere'],
  ae: ['after effects', 'adobe after effects'],
  ai: ['illustrator', 'adobe illustrator'],
  idm: ['internet download manager'],
  fdm: ['free download manager'],
  '视频编辑': ['video editing', '剪辑'],
  '图片编辑': ['image editing', '修图'],
  '下载工具': ['download', '下载器'],
  '办公软件': ['office', '办公'],
};

// 拼写容错映射（常见拼写错误）
const SPELLING_FIXES: Record<string, string> = {
  'photoshop': 'photoshop',
  'photosop': 'photoshop',
  'premiere': 'premiere',
  'premier': 'premiere',
  'illustrator': 'illustrator',
  'illustrater': 'illustrator',
};

/**
 * 扩展搜索关键词（同义词 + 拼写容错）
 */
export function expandSearchQuery(query: string): string[] {
  const normalized = query.toLowerCase().trim();
  const keywords = [normalized];

  // 拼写容错
  if (SPELLING_FIXES[normalized]) {
    keywords.push(SPELLING_FIXES[normalized]);
  }

  // 同义词扩展
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      keywords.push(...synonyms);
    }
    for (const synonym of synonyms) {
      if (normalized.includes(synonym) || synonym.includes(normalized)) {
        keywords.push(key, ...synonyms);
      }
    }
  }

  return [...new Set(keywords)];
}

/**
 * 检查文本是否匹配关键词（支持同义词和拼写容错）
 */
export function fuzzyMatch(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase();
  const expanded = expandSearchQuery(query);
  return expanded.some((keyword) => normalizedText.includes(keyword));
}

/**
 * 平台筛选
 */
export function filterByPlatform(items: Array<{ platforms?: string[] }>, platform: string): Array<{ platforms?: string[] }> {
  if (!platform || platform === 'all') return items;
  const lower = platform.toLowerCase();
  return items.filter((item) => item.platforms?.some((p) => p.toLowerCase().includes(lower)));
}

/**
 * 类别筛选
 */
export function filterByCategory(items: Array<{ category?: string; category_i18n?: Record<string, string> }>, category: string, lang?: string): Array<{ category?: string; category_i18n?: Record<string, string> }> {
  if (!category || category === 'all') return items;
  const lower = category.toLowerCase();
  return items.filter((item) => {
    const name = item.category?.toLowerCase() || '';
    const localized = item.category_i18n && lang ? (item.category_i18n[lang] || '').toLowerCase() : '';
    return name.includes(lower) || localized.includes(lower);
  });
}

/**
 * 更新时间筛选
 */
export function filterByUpdateTime(items: Array<{ updatedAt?: string }>, timeRange: 'all' | 'week' | 'month' | 'year'): Array<{ updatedAt?: string }> {
  if (timeRange === 'all') return items;
  const now = Date.now();
  const ranges: Record<string, number> = {
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };
  const threshold = now - ranges[timeRange];
  return items.filter((item) => {
    if (!item.updatedAt) return false;
    const time = Date.parse(item.updatedAt);
    return !Number.isNaN(time) && time >= threshold;
  });
}

