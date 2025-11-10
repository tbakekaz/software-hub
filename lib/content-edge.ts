// Edge Runtime 专用的内容加载器（不使用文件系统）
// 此文件仅用于 Edge Runtime，从预生成的数据读取

// 注意：不导入 lib/content.ts 的类型，因为它包含 Node.js 模块导入
// 直接从生成的 content.ts 导入类型定义

// 使用静态 ES6 import（在构建时解析，Edge Runtime 完全支持）
// 如果文件不存在，构建会失败，这是预期的行为
import {
  loadAllSoftware as loadAllSoftwarePages,
  loadSoftwarePage as loadSoftwarePageData,
  loadFirstSoftwarePage,
  softwareManifest,
} from './generated/software/loader';
import { allTutorials, allTutorialsMeta } from './generated/tutorials';
import { allAI } from './generated/ai';

// 定义类型（避免导入 lib/content.ts）
export type DownloadSource = {
  type: '123pan' | 'r2' | 'other';
  url: string;
  label?: string;
};

export type Software = {
  slug: string;
  name: string;
  name_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  version: string;
  platforms: string[];
  category: string;
  category_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  isDomestic: boolean;
  description: string;
  description_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  homepage: string;
  downloads: {
    platform: string;
    version?: string;
    url?: string;
    mirrorUrls?: string[];
    sources?: Array<{ type: '123pan' | 'r2' | 'other'; url: string; label?: string }>;
  }[];
  updatedAt: string;
};

export type TutorialMeta = {
  title: string;
  title_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  slug: string;
  date: string;
  softwareSlug: string;
  summary?: string;
  summary_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  tags?: string[];
};

export type AIItem = {
  name: string;
  name_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  url: string;
  tags: string[];
  category: string;
  description: string;
  description_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  locale: string[];
  icon: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isInternational?: boolean;
};

export type EnglishResource = {
  slug: string;
  title: string;
  title_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  category: 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'course';
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  description_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  thumbnail?: string;
  resources: {
    type: 'video' | 'document' | 'audio' | 'pdf' | 'link';
    title: string;
    url: string;
    size?: string;
    duration?: string;
    format?: string;
  }[];
  tags?: string[];
  date: string;
  updatedAt?: string;
  isFeatured?: boolean;
  isFree?: boolean;
};

let softwareCache: Software[] | null = null;

export { softwareManifest };

export async function getAllSoftware(): Promise<Software[]> {
  if (softwareCache) return softwareCache;
  const data = await loadAllSoftwarePages();
  softwareCache = (data as unknown as Software[]);
  return softwareCache;
}

export async function getSoftware(slug: string): Promise<Software | null> {
  const all = await getAllSoftware();
  return all.find((s) => s.slug === slug) || null;
}

export async function getSoftwarePage(pageIndex: number): Promise<Software[]> {
  const page = await loadSoftwarePageData(pageIndex);
  return page as unknown as Software[];
}

export async function getInitialSoftwarePage(): Promise<Software[]> {
  const first = await loadFirstSoftwarePage();
  return first as unknown as Software[];
}

export function getAllTutorials(): TutorialMeta[] {
  return allTutorialsMeta as unknown as TutorialMeta[];
}

export function getTutorialBySlug(slug: string) {
  const tutorials = allTutorials as unknown as Array<{ meta: TutorialMeta; content: string }>;
  const tutorial = tutorials.find((t) => t.meta?.slug === slug);
  if (!tutorial) return null;
  return { content: tutorial.content, meta: tutorial.meta };
}

export function getAllAI(): AIItem[] {
  return allAI as unknown as AIItem[];
}

export function getAllEnglish(): EnglishResource[] {
  try {
    const { allEnglish } = require('./generated/english');
    return allEnglish as unknown as EnglishResource[];
  } catch {
    return [];
  }
}

export function getEnglishBySlug(slug: string): EnglishResource | null {
  const all = getAllEnglish();
  return all.find((item) => item.slug === slug) || null;
}

export function getSoftwareCategories(): string[] {
  return (softwareManifest.categories || []).slice();
}

export async function getSoftwareByCategory(category: string): Promise<Software[]> {
  if (!category) return getAllSoftware();
  const lower = category.toLowerCase();
  const all = await getAllSoftware();
  return all.filter((item) => {
    const name = item.category?.toLowerCase() || '';
    const localized = typeof item.category_i18n === 'object'
      ? Object.values(item.category_i18n).join(' ').toLowerCase()
      : '';
    return name.includes(lower) || localized.includes(lower);
  });
}

export async function getRecentSoftware(limit = 6): Promise<Software[]> {
  const all = await getAllSoftware();
  const sorted = [...all].sort((a, b) => {
    const getTime = (value?: string) => {
      const t = value ? Date.parse(value) : NaN;
      return Number.isFinite(t) ? t : 0;
    };
    return getTime(b.updatedAt) - getTime(a.updatedAt);
  });
  return sorted.slice(0, limit);
}

export function getSoftwareTags(): string[] {
  const set = new Set<string>();
  const cache = softwareCache;
  if (cache) {
    cache.forEach((item) => {
      item.downloads?.forEach((download) => {
        download.sources?.forEach((source) => {
          if (source.label) set.add(source.label);
        });
      });
    });
  }
  return [...set];
}

export function getSoftwareManifest() {
  return softwareManifest;
}

