'use client';

import type { Lang } from '@/lib/i18n';

interface HandProps {
  hand: 'left' | 'right';
  currentFinger: string | null;
  lang?: Lang;
}

export function Hand({ hand, currentFinger, lang = 'zh' }: HandProps) {
  // 获取手指位置（用于定位圆圈标记）
  const getFingerPosition = (finger: string): { top: string; left?: string; right?: string } => {
    // 左手手指位置（从右到左：小指、无名指、中指、食指）
    if (finger === 'pinky-l') return { top: '10%', left: '5%' };
    if (finger === 'ring-l') return { top: '8%', left: '25%' };
    if (finger === 'middle-l') return { top: '6%', left: '48%' };
    if (finger === 'index-l') return { top: '8%', left: '68%' };
    if (finger === 'thumb-l') return { top: '62%', left: '78%' };
    
    // 右手手指位置（从左到右：食指、中指、无名指、小指）
    if (finger === 'index-r') return { top: '8%', right: '68%' };
    if (finger === 'middle-r') return { top: '6%', right: '48%' };
    if (finger === 'ring-r') return { top: '8%', right: '25%' };
    if (finger === 'pinky-r') return { top: '10%', right: '5%' };
    if (finger === 'thumb-r') return { top: '62%', right: '78%' };
    
    return { top: '50%', left: '50%' };
  };

  const isLeft = hand === 'left';
  const shouldShowMarker = isLeft 
    ? (currentFinger && currentFinger.includes('-l'))
    : (currentFinger && currentFinger.includes('-r'));

  return (
    <div className="relative w-32 h-40 flex-shrink-0">
      <svg viewBox="0 0 120 140" className="w-full h-full">
        {/* 手掌 - 更真实的形状 */}
        <path
          d="M 30 90 Q 25 100 30 110 Q 35 115 50 115 Q 65 115 70 110 Q 75 100 70 90 Q 65 80 50 80 Q 35 80 30 90 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-gray-400 dark:text-gray-600"
        />
        
        {isLeft ? (
          <>
            {/* 左手：小指 */}
            <path
              d="M 20 25 Q 18 15 22 8 Q 26 2 30 5 Q 34 8 32 18 Q 30 28 26 32 Q 22 30 20 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="28" y1="30" x2="32" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 无名指 */}
            <path
              d="M 38 22 Q 36 12 40 5 Q 44 0 48 3 Q 52 6 50 16 Q 48 26 44 30 Q 40 28 38 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="46" y1="28" x2="50" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 中指 - 最长 */}
            <path
              d="M 56 18 Q 54 8 58 2 Q 62 -2 66 1 Q 70 4 68 14 Q 66 24 62 28 Q 58 26 56 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="64" y1="26" x2="60" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 食指 */}
            <path
              d="M 74 22 Q 72 12 76 5 Q 80 0 84 3 Q 88 6 86 16 Q 84 26 80 30 Q 76 28 74 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="82" y1="28" x2="78" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 拇指 - 更真实的位置和形状 */}
            <path
              d="M 88 75 Q 92 70 95 72 Q 98 74 96 80 Q 94 86 90 88 Q 86 86 88 80 Q 86 76 88 75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
          </>
        ) : (
          <>
            {/* 右手：食指 */}
            <path
              d="M 20 22 Q 18 12 22 5 Q 26 0 30 3 Q 34 6 32 16 Q 30 26 26 30 Q 22 28 20 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="28" y1="28" x2="32" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 中指 - 最长 */}
            <path
              d="M 38 18 Q 36 8 40 2 Q 44 -2 48 1 Q 52 4 50 14 Q 48 24 44 28 Q 40 26 38 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="46" y1="26" x2="50" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 无名指 */}
            <path
              d="M 56 22 Q 54 12 58 5 Q 62 0 66 3 Q 70 6 68 16 Q 66 26 62 30 Q 58 28 56 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="64" y1="28" x2="60" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 小指 */}
            <path
              d="M 74 25 Q 72 15 76 8 Q 80 2 84 5 Q 88 8 86 18 Q 84 28 80 32 Q 76 30 74 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
            <line x1="82" y1="30" x2="78" y2="75" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-600" />
            
            {/* 拇指 - 更真实的位置和形状 */}
            <path
              d="M 32 75 Q 28 70 25 72 Q 22 74 24 80 Q 26 86 30 88 Q 34 86 32 80 Q 34 76 32 75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-gray-400 dark:text-gray-600"
            />
          </>
        )}
      </svg>
      
      {/* 手指圆圈标记 */}
      {shouldShowMarker && currentFinger && (
        <div
          className="absolute w-7 h-7 rounded-full bg-green-500 border-2 border-green-700 shadow-lg transition-all z-10"
          style={getFingerPosition(currentFinger)}
        />
      )}
    </div>
  );
}
