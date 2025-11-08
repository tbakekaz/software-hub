// Edge Runtime 专用的内容加载器（不使用文件系统）
// 此文件仅用于 Edge Runtime，从预生成的数据读取

import type { Software, TutorialMeta, AIItem } from './content';

// 导入预生成的数据
let generatedContent: {
  allSoftware?: Software[];
  allTutorials?: Array<{ meta: TutorialMeta; content: string }>;
  allTutorialsMeta?: TutorialMeta[];
  allAI?: AIItem[];
} = {};

try {
  const generated = require('./generated/content');
  generatedContent = {
    allSoftware: generated.allSoftware,
    allTutorials: generated.allTutorials,
    allTutorialsMeta: generated.allTutorialsMeta,
    allAI: generated.allAI,
  };
} catch {
  // 如果文件不存在，返回空数据
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

