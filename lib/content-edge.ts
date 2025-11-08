// Edge Runtime 专用的内容加载器（不使用文件系统）
// 此文件仅用于 Edge Runtime，从预生成的数据读取

import type { Software, TutorialMeta, AIItem } from './content';

// 静态导入预生成的数据（在构建时解析，Edge Runtime 支持）
// 使用 try-catch 包装，以便在导入失败时提供空数据
let generatedContent: {
  allSoftware: Software[];
  allTutorials: Array<{ meta: TutorialMeta; content: string }>;
  allTutorialsMeta: TutorialMeta[];
  allAI: AIItem[];
};

try {
  // 静态导入（在构建时解析）
  const generated = require('./generated/content');
  generatedContent = {
    allSoftware: generated.allSoftware || [],
    allTutorials: generated.allTutorials || [],
    allTutorialsMeta: generated.allTutorialsMeta || [],
    allAI: generated.allAI || [],
  };
} catch (error: any) {
  // 如果导入失败，使用空数据（不应该发生，因为 prebuild 会生成文件）
  console.error('[content-edge] Failed to import generated content:', error?.message || error);
  generatedContent = {
    allSoftware: [],
    allTutorials: [],
    allTutorialsMeta: [],
    allAI: [],
  };
}

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
  const tutorial = tutorials.find((t) => t.meta.slug === slug);
  if (!tutorial) return null;
  return { content: tutorial.content, meta: tutorial.meta as TutorialMeta };
}

export function getAllAI(): AIItem[] {
  return generatedContent.allAI || [];
}

