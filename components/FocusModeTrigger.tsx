'use client';

import { useState, useEffect } from 'react';
import { FocusMode, type FocusDuration } from './FocusMode';
import { Button } from '@/components/ui/button';
import { saveFocusSession } from '@/lib/focus-stats';
import type { Lang } from '@/lib/i18n';
import { t } from '@/lib/i18n';

interface FocusModeTriggerProps {
  className?: string;
  variant?: 'button' | 'floating';
}

export function FocusModeTrigger({ className, variant = 'button' }: FocusModeTriggerProps) {
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    // 从 cookie 读取语言
    if (typeof window !== 'undefined') {
      const cookieLang = document.cookie
        .split('; ')
        .find(row => row.startsWith('lang='))
        ?.split('=')[1] as Lang | undefined;
      if (cookieLang === 'zh' || cookieLang === 'kk' || cookieLang === 'ru' || cookieLang === 'en') {
        setLang(cookieLang);
      }
    }
  }, []);

  const dict = t(lang).focusMode || {};

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
      const minutes = Math.floor(actualTime / 60);
      alert(`🎉 ${dict.completed || '恭喜完成专注学习！'} ${duration} ${dict.minutes || '分钟'}\n${dict.actualTime || '实际专注时长'}: ${minutes} ${dict.minutes || '分钟'}`);
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
            lang={lang}
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
        🎯 {dict.title || '专注学习'}
      </Button>
      {showFocusMode && (
        <FocusMode
          onComplete={handleComplete}
          onClose={() => setShowFocusMode(false)}
          lang={lang}
        />
      )}
    </>
  );
}

