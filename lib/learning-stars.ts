'use client';

export type StarRating = 1 | 2 | 3; // 1星=完成, 2星=良好, 3星=优秀

export type CourseCompletion = {
  resourceSlug: string;
  stars: StarRating;
  completedAt: string;
  timeSpent: number; // 分钟
  resourcesCompleted: number; // 完成的资源数量
  totalResources: number;
  score?: number; // 如果有测试，记录分数
};

export type LearningStats = {
  totalStars: number;
  totalCourses: number;
  totalTimeSpent: number; // 总学习时长（分钟）
  level: number; // 用户等级
  experience: number; // 经验值
  achievements: string[]; // 成就ID列表
  completedCourses: CourseCompletion[];
};

export function calculateLevel(experience: number): number {
  // 等级公式：level = floor(sqrt(experience / 100)) + 1
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

export function getExperienceForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getExperienceProgress(experience: number): {
  currentLevel: number;
  nextLevel: number;
  currentExp: number;
  requiredExp: number;
  progress: number; // 0-100
} {
  const currentLevel = calculateLevel(experience);
  const nextLevel = currentLevel + 1;
  const currentExp = getExperienceForLevel(currentLevel);
  const requiredExp = getExperienceForLevel(nextLevel);
  const progress = ((experience - currentExp) / (requiredExp - currentExp)) * 100;
  
  return {
    currentLevel,
    nextLevel,
    currentExp,
    requiredExp,
    progress: Math.min(100, Math.max(0, progress))
  };
}

