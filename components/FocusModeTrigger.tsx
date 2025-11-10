'use client';

import { useState } from 'react';
import { FocusMode, type FocusDuration } from './FocusMode';
import { Button } from '@/components/ui/button';
import { saveFocusSession } from '@/lib/focus-stats';

interface FocusModeTriggerProps {
  className?: string;
  variant?: 'button' | 'floating';
}

export function FocusModeTrigger({ className, variant = 'button' }: FocusModeTriggerProps) {
  const [showFocusMode, setShowFocusMode] = useState(false);

  const handleComplete = (duration: FocusDuration, actualTime: number) => {
    // 保存专注会话记录
    saveFocusSession({
      duration,
      actualTime,
      completedAt: new Date().toISOString(),
      completed: true
    });

    // 显示完成提示
    setTimeout(() => {
      alert(`🎉 恭喜完成 ${duration} 分钟专注学习！\n实际专注时长：${Math.floor(actualTime / 60)} 分钟`);
      setShowFocusMode(false);
    }, 2000);
  };

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setShowFocusMode(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 flex items-center justify-center text-2xl"
          aria-label="开启专注模式"
        >
          🎯
        </button>
        {showFocusMode && (
          <FocusMode
            onComplete={handleComplete}
            onClose={() => setShowFocusMode(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowFocusMode(true)}
        className={className}
        variant="outline"
      >
        🎯 专注学习
      </Button>
      {showFocusMode && (
        <FocusMode
          onComplete={handleComplete}
          onClose={() => setShowFocusMode(false)}
        />
      )}
    </>
  );
}

