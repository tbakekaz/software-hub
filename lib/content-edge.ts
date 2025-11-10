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

