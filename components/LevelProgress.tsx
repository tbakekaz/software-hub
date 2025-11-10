'use client';

import { getExperienceProgress } from '@/lib/learning-stars';

interface LevelProgressProps {
  experience: number;
}

export function LevelProgress({ experience }: LevelProgressProps) {
  const progress = getExperienceProgress(experience);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏅</span>
          <div>
            <div className="font-bold text-lg">等级 {progress.currentLevel}</div>
            <div className="text-sm text-muted-foreground">
              {progress.currentExp} / {progress.requiredExp} 经验值
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">下一级</div>
          <div className="font-bold">等级 {progress.nextLevel}</div>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
          style={{ width: `${progress.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

