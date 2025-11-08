// 在 Edge Runtime 中使用预生成的数据，在开发环境使用文件系统
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// 尝试导入预生成的数据（在构建时生成）
let generatedContent: {
  allSoftware?: any[];
  allTutorials?: Array<{ meta: any; content: string }>;
  allTutorialsMeta?: any[];
  allAI?: any[];
} = {};

try {
  // 尝试导入预生成的数据（在构建时可用）
  const generated = require('./generated/content');
  generatedContent = {
    allSoftware: generated.allSoftware,
    allTutorials: generated.allTutorials,
    allTutorialsMeta: generated.allTutorialsMeta,
    allAI: generated.allAI,
  };
} catch {
  // 如果文件不存在（开发环境或首次构建），generatedContent 保持为空对象
}

// 检测是否在 Edge Runtime 中运行
// 在 Edge Runtime 中，fs 模块不可用
const isEdgeRuntime = 
  typeof EdgeRuntime !== 'undefined' ||
  (typeof process !== 'undefined' && process.env?.NEXT_RUNTIME === 'edge');

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
  // 在 Edge Runtime 中，必须使用预生成数据
  if (isEdgeRuntime) {
    // 在 Edge Runtime 中，使用动态导入（异步，但 Next.js 会处理）
    // 注意：这需要在构建时确保文件存在
    if (generatedContent.allSoftware) {
      return generatedContent.allSoftware as Software[];
    }
    // 如果数据未加载，返回空数组（不应该发生，因为构建时会生成）
    return [];
  }
  // 在 Node.js 环境中，优先使用预生成数据（如果存在）
  if (generatedContent.allSoftware && generatedContent.allSoftware.length > 0) {
    return generatedContent.allSoftware as Software[];
  }
  // 否则使用文件系统（开发环境）
  const dir = path.join(root, 'content/software');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Software)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSoftware(slug: string): Software | null {
  if (isEdgeRuntime) {
    const all = getAllSoftware();
    return all.find((s) => s.slug === slug) || null;
  }
  if (generatedContent.allSoftware && generatedContent.allSoftware.length > 0) {
    return (generatedContent.allSoftware as Software[]).find((s) => s.slug === slug) || null;
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
    if (generatedContent.allTutorialsMeta) {
      return generatedContent.allTutorialsMeta as TutorialMeta[];
    }
    return [];
  }
  if (generatedContent.allTutorialsMeta && generatedContent.allTutorialsMeta.length > 0) {
    return generatedContent.allTutorialsMeta as TutorialMeta[];
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
    if (generatedContent.allTutorials) {
      const tutorials = generatedContent.allTutorials as Array<{ meta: TutorialMeta; content: string }>;
      const tutorial = tutorials.find((t) => t.meta.slug === slug);
      if (!tutorial) return null;
      return { content: tutorial.content, meta: tutorial.meta as TutorialMeta };
    }
    return null;
  }
  if (generatedContent.allTutorials && generatedContent.allTutorials.length > 0) {
    const tutorials = generatedContent.allTutorials as Array<{ meta: TutorialMeta; content: string }>;
    const tutorial = tutorials.find((t) => t.meta.slug === slug);
    if (!tutorial) return null;
    return { content: tutorial.content, meta: tutorial.meta as TutorialMeta };
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
};

export function getAllAI(): AIItem[] {
  if (isEdgeRuntime) {
    if (generatedContent.allAI) {
      return generatedContent.allAI as AIItem[];
    }
    return [];
  }
  if (generatedContent.allAI && generatedContent.allAI.length > 0) {
    return generatedContent.allAI as AIItem[];
  }
  const dir = path.join(root, 'content/ai');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as AIItem)
    .sort((a, b) => a.name.localeCompare(b.name));
}
