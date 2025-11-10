'use client';

import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { AchievementBadge } from './AchievementBadge';
import { getAchievementById } from '@/lib/achievements';
import type { Achievement } from '@/lib/achievements';

interface CourseCompletionModalProps {
  stars: 1 | 2 | 3;
  newAchievements?: string[];
  experienceGained: number;
  onClose: () => void;
}

export function CourseCompletionModal({
  stars,
  newAchievements = [],
  experienceGained,
  onClose
}: CourseCompletionModalProps) {
  const [show, setShow] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => {
    const ach = newAchievements.map(id => getAchievementById(id)).filter(Boolean) as Achievement[];
    setAchievements(ach);
  }, [newAchievements]);
  
  useEffect(() => {
    // 3秒后自动关闭
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border-2 border-yellow-400 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-bounce-in">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold">恭喜完成课程！</h2>
          
          <div className="py-4">
            <StarRating stars={stars} size="lg" showLabel />
          </div>
          
          {achievements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">获得新成就：</p>
              <div className="flex justify-center gap-2">
                {achievements.map((ach) => (
                  <AchievementBadge key={ach.id} achievement={ach} unlocked />
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">获得经验值</div>
            <div className="text-2xl font-bold text-primary">+{experienceGained}</div>
          </div>
          
          <button
            onClick={() => {
              setShow(false);
              onClose();
            }}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            继续学习
          </button>
        </div>
      </div>
    </div>
  );
}

