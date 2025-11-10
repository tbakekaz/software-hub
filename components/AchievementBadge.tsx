'use client';

import type { Achievement } from '@/lib/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, unlocked, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };
  
  const rarityColors = {
    common: 'border-gray-400 bg-gray-50 dark:bg-gray-900',
    rare: 'border-blue-400 bg-blue-50 dark:bg-blue-900',
    epic: 'border-purple-400 bg-purple-50 dark:bg-purple-900',
    legendary: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900'
  };
  
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full border-2 flex items-center justify-center
        ${unlocked ? rarityColors[achievement.rarity] : 'opacity-30 grayscale'}
        transition-all hover:scale-110 cursor-pointer
      `}
      title={achievement.name}
    >
      {achievement.icon}
    </div>
  );
}

