// Edge Runtime 专用的内容加载器（不使用文件系统）
// 此文件仅用于 Edge Runtime，从预生成的数据读取

import type { Software, TutorialMeta, AIItem } from './content';

// 静态导入预生成的数据（在构建时解析，Edge Runtime 支持）
// 注意：如果文件不存在，构建会失败，这是预期的行为
import * as generated from './generated/content';

// 使用导入的数据，提供默认值以防万一
const generatedContent = {
  allSoftware: generated.allSoftware || [],
  allTutorials: generated.allTutorials || [],
  allTutorialsMeta: generated.allTutorialsMeta || [],
  allAI: generated.allAI || [],
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
  const tutorial = tutorials.find((t) => t.meta.slug === slug);
  if (!tutorial) return null;
  return { content: tutorial.content, meta: tutorial.meta as TutorialMeta };
}

export function getAllAI(): AIItem[] {
  return generatedContent.allAI || [];
}

