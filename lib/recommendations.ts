import type { Software, AIItem } from './content-edge';

/**
 * 获取相关软件推荐
 * 基于类别、标签和名称相似度
 */
export function getRelatedSoftware(
  currentSoftware: Software,
  allSoftware: Software[],
  limit: number = 6
): Software[] {
  const related: Array<{ software: Software; score: number }> = [];

  for (const software of allSoftware) {
    if (software.slug === currentSoftware.slug) continue;

    let score = 0;

    // 类别匹配（权重：3）
    if (software.category === currentSoftware.category) {
      score += 3;
    }

    // 平台匹配（权重：2）
    const commonPlatforms = software.platforms.filter((p) =>
      currentSoftware.platforms.includes(p)
    );
    score += commonPlatforms.length * 2;

    // 名称相似度（权重：1）
    const currentName = currentSoftware.name.toLowerCase();
    const otherName = software.name.toLowerCase();
    if (otherName.includes(currentName.split(' ')[0]) || currentName.includes(otherName.split(' ')[0])) {
      score += 1;
    }

    // 如果是同一品牌（如 Adobe）
    const currentBrand = currentName.split(' ')[0];
    const otherBrand = otherName.split(' ')[0];
    if (currentBrand === otherBrand && currentBrand.length > 2) {
      score += 2;
    }

    if (score > 0) {
      related.push({ software, score });
    }
  }

  // 按分数排序，返回前 limit 个
  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.software);
}

/**
 * 获取热门软件（基于更新日期和类别）
 */
export function getPopularSoftware(
  allSoftware: Software[],
  limit: number = 6
): Software[] {
  return [...allSoftware]
    .sort((a, b) => {
      // 优先显示最近更新的
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

/**
 * 获取推荐的 AI 工具
 * 基于类别和标签
 */
export function getRecommendedAI(
  currentAI: AIItem | null,
  allAI: AIItem[],
  limit: number = 6
): AIItem[] {
  if (!currentAI) {
    // 如果没有当前 AI，返回精选的
    return allAI.filter((ai) => ai.isFeatured).slice(0, limit);
  }

  const related: Array<{ ai: AIItem; score: number }> = [];

  for (const ai of allAI) {
    if (ai.name === currentAI.name) continue;

    let score = 0;

    // 类别匹配（权重：3）
    if (ai.category === currentAI.category) {
      score += 3;
    }

    // 标签匹配（权重：1）
    const commonTags = ai.tags.filter((tag) => currentAI.tags.includes(tag));
    score += commonTags.length;

    // 语言匹配（权重：2）
    const commonLocale = ai.locale.filter((loc) => currentAI.locale.includes(loc));
    score += commonLocale.length * 2;

    // 精选加成（权重：1）
    if (ai.isFeatured) {
      score += 1;
    }

    if (score > 0) {
      related.push({ ai, score });
    }
  }

  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.ai);
}

/**
 * 根据搜索查询推荐内容
 */
export function getSearchRecommendations(
  query: string,
  allSoftware: Software[],
  allAI: AIItem[],
  limit: number = 5
): { software: Software[]; ai: AIItem[] } {
  const q = query.toLowerCase().trim();
  if (!q) {
    return { software: [], ai: [] };
  }

  const softwareResults: Array<{ software: Software; score: number }> = [];
  const aiResults: Array<{ ai: AIItem; score: number }> = [];

  // 搜索软件
  for (const software of allSoftware) {
    let score = 0;
    const name = software.name.toLowerCase();
    const desc = software.description.toLowerCase();
    const category = software.category.toLowerCase();

    if (name.includes(q)) score += 5;
    if (desc.includes(q)) score += 2;
    if (category.includes(q)) score += 1;

    if (score > 0) {
      softwareResults.push({ software, score });
    }
  }

  // 搜索 AI 工具
  for (const ai of allAI) {
    let score = 0;
    const name = ai.name.toLowerCase();
    const desc = ai.description.toLowerCase();
    const category = ai.category.toLowerCase();
    const tags = ai.tags.join(' ').toLowerCase();

    if (name.includes(q)) score += 5;
    if (desc.includes(q)) score += 2;
    if (category.includes(q)) score += 1;
    if (tags.includes(q)) score += 1;

    if (score > 0) {
      aiResults.push({ ai, score });
    }
  }

  return {
    software: softwareResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.software),
    ai: aiResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.ai),
  };
}



