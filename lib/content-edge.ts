// Edge Runtime 专用的内容加载器（不使用文件系统）
// 此文件仅用于 Edge Runtime，从预生成的数据读取

import type { Software, TutorialMeta, AIItem } from './content';

// 使用静态 ES6 import（在构建时解析，Edge Runtime 完全支持）
// 如果文件不存在，构建会失败，这是预期的行为
import {
  allSoftware as _allSoftware,
  allTutorials as _allTutorials,
  allTutorialsMeta as _allTutorialsMeta,
  allAI as _allAI,
} from './generated/content';

// 使用导入的数据，提供默认值以防万一
const generatedContent = {
  allSoftware: _allSoftware || [],
  allTutorials: _allTutorials || [],
  allTutorialsMeta: _allTutorialsMeta || [],
  allAI: _allAI || [],
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

