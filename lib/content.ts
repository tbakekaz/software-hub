// 在 Edge Runtime 中使用预生成的数据，在开发环境使用文件系统
// 注意：在 Edge Runtime 中，应该使用 lib/content-edge.ts 而不是此文件
// 此文件主要用于类型导出和开发环境的文件系统访问

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// 检测是否在 Edge Runtime 中运行
// 在 Edge Runtime 中，fs 模块不可用
const isEdgeRuntime = 
  (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis) ||
  (typeof process !== 'undefined' && process.env?.NEXT_RUNTIME === 'edge');

// 注意：不再在顶层尝试导入生成的内容
// 在 Edge Runtime 中，应该使用 lib/content-edge.ts
// 在开发环境中，直接使用文件系统即可

const root = process.cwd();

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
    // 版本号（如 "2024", "2023"），可选，不指定则使用软件顶层 version
    version?: string;
    // 向后兼容：保留 url 和 mirrorUrls
    url?: string;
    mirrorUrls?: string[];
    // 新格式：支持多个下载源
    sources?: DownloadSource[];
  }[];
  updatedAt: string;
};

export function getAllSoftware(): Software[] {
  // 在 Edge Runtime 中，不应该使用此函数
  // 应该使用 lib/content-edge.ts 中的函数
  if (isEdgeRuntime) {
    // 返回空数组，因为 Edge Runtime 应该使用 content-edge.ts
    return [];
  }
  // 在 Node.js 环境中，使用文件系统（开发环境）
  const dir = path.join(root, 'content/software');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Software)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSoftware(slug: string): Software | null {
  if (isEdgeRuntime) {
    // 在 Edge Runtime 中，不应该使用此函数
    // 应该使用 lib/content-edge.ts 中的函数
    return null;
  }
  const p = path.join(root, 'content/software', `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8')) as Software;
}

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

export function getAllTutorials(): TutorialMeta[] {
  if (isEdgeRuntime) {
    // 在 Edge Runtime 中，不应该使用此函数
    // 应该使用 lib/content-edge.ts 中的函数
    return [];
  }
  const dir = path.join(root, 'content/tutorials');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      const { data } = matter(raw);
      return data as TutorialMeta;
    })
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

export function getTutorialBySlug(slug: string) {
  if (isEdgeRuntime) {
    // 在 Edge Runtime 中，不应该使用此函数
    // 应该使用 lib/content-edge.ts 中的函数
    return null;
  }
  const p = path.join(root, 'content/tutorials', `${slug}.mdx`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf8');
  const { content, data } = matter(raw);
  return { content, meta: data as TutorialMeta };
}

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

export function getAllAI(): AIItem[] {
  if (isEdgeRuntime) {
    // 在 Edge Runtime 中，不应该使用此函数
    // 应该使用 lib/content-edge.ts 中的函数
    return [];
  }
  const dir = path.join(root, 'content/ai');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as AIItem)
    .sort((a, b) => a.name.localeCompare(b.name));
}
