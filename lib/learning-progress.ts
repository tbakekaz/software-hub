'use client';

import type { LanguageResource } from '@/lib/content-edge';
import type { StarRating, CourseCompletion, LearningStats } from '@/lib/learning-stars';
import { achievements } from '@/lib/achievements';

const STORAGE_KEY = 'learning_stats';

export function getLearningStats(): LearningStats {
  if (typeof window === 'undefined') {
    return {
      totalStars: 0,
      totalCourses: 0,
      totalTimeSpent: 0,
      level: 1,
      experience: 0,
      achievements: [],
      completedCourses: []
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      totalStars: 0,
      totalCourses: 0,
      totalTimeSpent: 0,
      level: 1,
      experience: 0,
      achievements: [],
      completedCourses: []
    };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return {
      totalStars: 0,
      totalCourses: 0,
      totalTimeSpent: 0,
      level: 1,
      experience: 0,
      achievements: [],
      completedCourses: []
    };
  }
}

export function saveLearningStats(stats: LearningStats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function calculateLevel(experience: number): number {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

function checkNewAchievements(
  stats: LearningStats,
  oldStars: number,
  newStars: number,
  resource?: LanguageResource
): string[] {
  const newAchievements: string[] = [];
  
  // 检查所有成就条件
  for (const achievement of achievements) {
    if (stats.achievements.includes(achievement.id)) continue;
    
    let conditionMet = false;
    
    switch (achievement.condition.type) {
      case 'courses_completed':
        conditionMet = stats.totalCourses >= achievement.condition.value;
        break;
      case 'stars_collected':
        conditionMet = newStars >= achievement.condition.value;
        break;
      case 'time_spent':
        conditionMet = stats.totalTimeSpent >= achievement.condition.value;
        break;
      case 'category_master':
        if (resource && achievement.condition.category) {
          const categoryCount = stats.completedCourses.filter(c => {
            // 需要从资源中获取类别信息，这里简化处理
            return true; // 实际应该检查资源的category
          }).length;
          conditionMet = categoryCount >= achievement.condition.value;
        }
        break;
      case 'language_master':
        if (resource && achievement.condition.targetLanguage) {
          const langCount = stats.completedCourses.filter(c => {
            // 需要从资源中获取目标语言信息
            return true; // 实际应该检查资源的targetLanguage
          }).length;
          conditionMet = langCount >= achievement.condition.value;
        }
        break;
      case 'streak':
        // 简化处理，实际应该检查连续学习天数
        conditionMet = false;
        break;
    }
    
    if (conditionMet) {
      newAchievements.push(achievement.id);
    }
  }
  
  return newAchievements;
}

export function completeCourse(
  resource: LanguageResource,
  stars: StarRating,
  timeSpent: number,
  resourcesCompleted: number
): { stats: LearningStats; experienceGained: number; newAchievements: string[] } {
  const stats = getLearningStats();
  
  // 检查是否已完成
  const existing = stats.completedCourses.find(c => c.resourceSlug === resource.slug);
  if (existing && existing.stars >= stars) {
    return { stats, experienceGained: 0, newAchievements: [] };
  }
  
  // 更新完成记录
  const completion: CourseCompletion = {
    resourceSlug: resource.slug,
    stars,
    completedAt: new Date().toISOString(),
    timeSpent,
    resourcesCompleted,
    totalResources: resource.resources.length
  };
  
  // 移除旧记录（如果存在）
  const filtered = stats.completedCourses.filter(c => c.resourceSlug !== resource.slug);
  filtered.push(completion);
  
  // 计算经验值
  const experienceGained = stars * 10 + Math.floor(timeSpent / 10); // 星星 + 学习时长
  const oldTotalStars = stats.totalStars;
  const newTotalStars = filtered.reduce((sum, c) => sum + c.stars, 0);
  
  // 更新统计
  stats.completedCourses = filtered;
  stats.totalStars = newTotalStars;
  stats.totalCourses = filtered.length;
  stats.totalTimeSpent += timeSpent;
  stats.experience += experienceGained;
  stats.level = calculateLevel(stats.experience);
  
  // 检查新成就
  const newAchievements = checkNewAchievements(stats, oldTotalStars, newTotalStars, resource);
  stats.achievements.push(...newAchievements);
  
  saveLearningStats(stats);
  
  return { stats, experienceGained, newAchievements };
}

export function getCourseCompletion(resourceSlug: string): CourseCompletion | null {
  const stats = getLearningStats();
  return stats.completedCourses.find(c => c.resourceSlug === resourceSlug) || null;
}

