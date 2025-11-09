// Edge Runtime 专用的内容加载器（不使用文件系统）
// 此文件仅用于 Edge Runtime，从预生成的数据读取

// 注意：不导入 lib/content.ts 的类型，因为它包含 Node.js 模块导入
// 直接从生成的 content.ts 导入类型定义

// 使用静态 ES6 import（在构建时解析，Edge Runtime 完全支持）
// 如果文件不存在，构建会失败，这是预期的行为
import {
  allSoftware as _allSoftware,
  allTutorials as _allTutorials,
  allTutorialsMeta as _allTutorialsMeta,
  allAI as _allAI,
} from './generated/content';

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

// 使用导入的数据，提供默认值以防万一
// 注意：生成的 content.ts 现在使用 as const，所以类型会被正确推断
const generatedContent = {
  allSoftware: (_allSoftware as any) || [],
  allTutorials: (_allTutorials as any) || [],
  allTutorialsMeta: (_allTutorialsMeta as any) || [],
  allAI: (_allAI as any) || [],
};

export function getAllSoftware(): Software[] {
  return generatedContent.allSoftware || [];
}

export function getSoftware(slug: string): Software | null {
  const all = getAllSoftware();
  return all.find((s) => s.slug === slug) || null;
}

export function getAllTutorials(): TutorialMeta[] {
  return generatedContent.allTutorialsMeta || [];
}

export function getTutorialBySlug(slug: string) {
  const tutorials = generatedContent.allTutorials || [];
  const tutorial = tutorials.find((t: any) => t.meta?.slug === slug);
  if (!tutorial) return null;
  return { content: tutorial.content, meta: tutorial.meta as TutorialMeta };
}

export function getAllAI(): AIItem[] {
  return generatedContent.allAI || [];
}

