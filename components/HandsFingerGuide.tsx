'use client';

import type { Lang } from '@/lib/i18n';

interface HandsFingerGuideProps {
  currentFinger: string | null; // 'pinky-l', 'ring-l', 'middle-l', 'index-l', 'thumb-l', 'index-r', 'middle-r', 'ring-r', 'pinky-r', 'thumb-r'
  lang?: Lang;
}

export function HandsFingerGuide({ currentFinger, lang = 'zh' }: HandsFingerGuideProps) {
  // 获取手指位置（用于定位圆圈标记）
  const getFingerPosition = (finger: string): { top: string; left?: string; right?: string } => {
    // 左手手指位置（从右到左：小指、无名指、中指、食指）
    if (finger === 'pinky-l') return { top: '20%', left: '5%' };
    if (finger === 'ring-l') return { top: '18%', left: '25%' };
    if (finger === 'middle-l') return { top: '15%', left: '45%' };
    if (finger === 'index-l') return { top: '18%', left: '65%' };
    if (finger === 'thumb-l') return { top: '70%', left: '75%' };
    
    // 右手手指位置（从左到右：食指、中指、无名指、小指）
    if (finger === 'index-r') return { top: '18%', right: '65%' };
    if (finger === 'middle-r') return { top: '15%', right: '45%' };
    if (finger === 'ring-r') return { top: '18%', right: '25%' };
    if (finger === 'pinky-r') return { top: '20%', right: '5%' };
    if (finger === 'thumb-r') return { top: '70%', right: '75%' };
    
    return { top: '50%', left: '50%' };
  };

  // 判断是左手还是右手
  const isLeft = currentFinger?.includes('-l') || false;
  const isRight = currentFinger?.includes('-r') || false;
  
  return (
    <div className="relative w-32 h-40 flex-shrink-0">
      {/* 只显示对应的一只手 */}
      {(isLeft || isRight) && (
        <>
          {/* 左手轮廓 */}
          {isLeft && (
            <div className="relative w-full h-full">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* 手掌轮廓 */}
          <path
            d="M 30 80 Q 20 90 25 100 Q 30 110 50 110 Q 70 110 75 100 Q 80 90 70 80 Q 60 70 50 70 Q 40 70 30 80 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          
          {/* 小指轮廓 */}
          <path
            d="M 20 20 Q 15 10 20 5 Q 25 0 30 5 Q 35 10 30 20 Q 25 30 20 30 Q 15 30 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="25" y1="30" x2="30" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 无名指轮廓 */}
          <path
            d="M 35 18 Q 30 8 35 3 Q 40 -2 45 3 Q 50 8 45 18 Q 40 28 35 28 Q 30 28 35 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="40" y1="28" x2="45" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 中指轮廓 */}
          <path
            d="M 50 15 Q 45 5 50 0 Q 55 -5 60 0 Q 65 5 60 15 Q 55 25 50 25 Q 45 25 50 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="55" y1="25" x2="55" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 食指轮廓 */}
          <path
            d="M 65 18 Q 60 8 65 3 Q 70 -2 75 3 Q 80 8 75 18 Q 70 28 65 28 Q 60 28 65 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="70" y1="28" x2="70" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 拇指轮廓 */}
          <path
            d="M 75 70 Q 80 75 85 80 Q 90 85 85 90 Q 80 95 75 90 Q 70 85 75 80 Q 70 75 75 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
        </svg>
        
              {/* 手指圆圈标记 */}
              {currentFinger && (
                <div
                  className="absolute w-6 h-6 rounded-full bg-green-500 border-2 border-green-700 shadow-lg transition-all animate-pulse"
                  style={getFingerPosition(currentFinger)}
                />
              )}
            </div>
          )}
          
          {/* 右手轮廓 */}
          {isRight && (
            <div className="relative w-full h-full">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* 手掌轮廓 */}
          <path
            d="M 30 80 Q 20 90 25 100 Q 30 110 50 110 Q 70 110 75 100 Q 80 90 70 80 Q 60 70 50 70 Q 40 70 30 80 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          
          {/* 食指轮廓 */}
          <path
            d="M 20 18 Q 15 8 20 3 Q 25 -2 30 3 Q 35 8 30 18 Q 25 28 20 28 Q 15 28 20 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="25" y1="28" x2="30" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 中指轮廓 */}
          <path
            d="M 35 15 Q 30 5 35 0 Q 40 -5 45 0 Q 50 5 45 15 Q 40 25 35 25 Q 30 25 35 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="40" y1="25" x2="45" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 无名指轮廓 */}
          <path
            d="M 50 18 Q 45 8 50 3 Q 55 -2 60 3 Q 65 8 60 18 Q 55 28 50 28 Q 45 28 50 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="55" y1="28" x2="60" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 小指轮廓 */}
          <path
            d="M 65 20 Q 60 10 65 5 Q 70 0 75 5 Q 80 10 75 20 Q 70 30 65 30 Q 60 30 65 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
          <line x1="70" y1="30" x2="75" y2="70" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600" />
          
          {/* 拇指轮廓 */}
          <path
            d="M 25 70 Q 20 75 15 80 Q 10 85 15 90 Q 20 95 25 90 Q 30 85 25 80 Q 30 75 25 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-600"
          />
        </svg>
        
              {/* 手指圆圈标记 */}
              {currentFinger && (
                <div
                  className="absolute w-6 h-6 rounded-full bg-green-500 border-2 border-green-700 shadow-lg transition-all animate-pulse"
                  style={getFingerPosition(currentFinger)}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
