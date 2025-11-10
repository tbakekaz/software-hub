'use client';

import type { Lang } from '@/lib/i18n';

interface HandsFingerGuideProps {
  currentFinger: string | null; // 'pinky-l', 'ring-l', 'middle-l', 'index-l', 'thumb-l', 'index-r', 'middle-r', 'ring-r', 'pinky-r', 'thumb-r'
  lang?: Lang;
}

export function HandsFingerGuide({ currentFinger, lang = 'zh' }: HandsFingerGuideProps) {
  // 手指颜色映射
  const getFingerColor = (finger: string, isActive: boolean): string => {
    if (!isActive) return 'bg-gray-200 dark:bg-gray-700';
    
    if (finger.includes('pinky')) return 'bg-blue-400 dark:bg-blue-600';
    if (finger.includes('ring')) return 'bg-green-400 dark:bg-green-600';
    if (finger.includes('middle')) return 'bg-yellow-400 dark:bg-yellow-600';
    if (finger.includes('index')) return 'bg-red-400 dark:bg-red-600';
    if (finger.includes('thumb')) return 'bg-purple-400 dark:bg-purple-600';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  // 手指名称
  const getFingerName = (finger: string): string => {
    if (finger.includes('pinky')) {
      return lang === 'zh' ? '小指' : lang === 'kk' ? 'Кішкентай саусақ' : lang === 'ru' ? 'Мизинец' : 'Pinky';
    }
    if (finger.includes('ring')) {
      return lang === 'zh' ? '无名指' : lang === 'kk' ? 'Анонимдік саусақ' : lang === 'ru' ? 'Безымянный' : 'Ring';
    }
    if (finger.includes('middle')) {
      return lang === 'zh' ? '中指' : lang === 'kk' ? 'Орта саусақ' : lang === 'ru' ? 'Средний' : 'Middle';
    }
    if (finger.includes('index')) {
      return lang === 'zh' ? '食指' : lang === 'kk' ? 'Сайыс саусақ' : lang === 'ru' ? 'Указательный' : 'Index';
    }
    if (finger.includes('thumb')) {
      return lang === 'zh' ? '拇指' : lang === 'kk' ? 'Бас бармақ' : lang === 'ru' ? 'Большой' : 'Thumb';
    }
    return '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-12">
        {/* 左手 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold text-muted-foreground mb-3">
            {lang === 'zh' ? '左手' : lang === 'kk' ? 'Сол қол' : lang === 'ru' ? 'Левая рука' : 'Left Hand'}
          </div>
          <div className="relative w-40 h-32">
            {/* 手掌 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            
            {/* 手指 - 从右到左：小指、无名指、中指、食指 */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
              {/* 小指 */}
              <div className={`w-7 h-20 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('pinky-l', currentFinger === 'pinky-l')
              } ${currentFinger === 'pinky-l' ? 'ring-2 ring-blue-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '小' : lang === 'kk' ? 'К' : lang === 'ru' ? 'М' : 'P'}
                </div>
              </div>
              
              {/* 无名指 */}
              <div className={`w-7 h-22 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('ring-l', currentFinger === 'ring-l')
              } ${currentFinger === 'ring-l' ? 'ring-2 ring-green-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '无' : lang === 'kk' ? 'А' : lang === 'ru' ? 'Б' : 'R'}
                </div>
              </div>
              
              {/* 中指 */}
              <div className={`w-7 h-24 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('middle-l', currentFinger === 'middle-l')
              } ${currentFinger === 'middle-l' ? 'ring-2 ring-yellow-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '中' : lang === 'kk' ? 'О' : lang === 'ru' ? 'С' : 'M'}
                </div>
              </div>
              
              {/* 食指 */}
              <div className={`w-7 h-22 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('index-l', currentFinger === 'index-l')
              } ${currentFinger === 'index-l' ? 'ring-2 ring-red-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '食' : lang === 'kk' ? 'С' : lang === 'ru' ? 'У' : 'I'}
                </div>
              </div>
            </div>
            
            {/* 拇指 */}
            <div className={`absolute bottom-4 -left-6 w-10 h-8 rounded-lg transition-all flex items-center justify-center ${
              getFingerColor('thumb-l', currentFinger === 'thumb-l')
            } ${currentFinger === 'thumb-l' ? 'ring-2 ring-purple-500 scale-110 z-10 shadow-lg' : ''}`}>
              <div className="text-[10px] font-bold">
                {lang === 'zh' ? '拇' : lang === 'kk' ? 'Б' : lang === 'ru' ? 'Б' : 'T'}
              </div>
            </div>
          </div>
        </div>

        {/* 右手 */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold text-muted-foreground mb-3">
            {lang === 'zh' ? '右手' : lang === 'kk' ? 'Оң қол' : lang === 'ru' ? 'Правая рука' : 'Right Hand'}
          </div>
          <div className="relative w-40 h-32">
            {/* 手掌 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            
            {/* 手指 - 从左到右：食指、中指、无名指、小指 */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
              {/* 食指 */}
              <div className={`w-7 h-22 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('index-r', currentFinger === 'index-r')
              } ${currentFinger === 'index-r' ? 'ring-2 ring-red-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '食' : lang === 'kk' ? 'С' : lang === 'ru' ? 'У' : 'I'}
                </div>
              </div>
              
              {/* 中指 */}
              <div className={`w-7 h-24 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('middle-r', currentFinger === 'middle-r')
              } ${currentFinger === 'middle-r' ? 'ring-2 ring-yellow-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '中' : lang === 'kk' ? 'О' : lang === 'ru' ? 'С' : 'M'}
                </div>
              </div>
              
              {/* 无名指 */}
              <div className={`w-7 h-22 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('ring-r', currentFinger === 'ring-r')
              } ${currentFinger === 'ring-r' ? 'ring-2 ring-green-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '无' : lang === 'kk' ? 'А' : lang === 'ru' ? 'Б' : 'R'}
                </div>
              </div>
              
              {/* 小指 */}
              <div className={`w-7 h-20 rounded-t-lg transition-all flex items-start justify-center pt-1 ${
                getFingerColor('pinky-r', currentFinger === 'pinky-r')
              } ${currentFinger === 'pinky-r' ? 'ring-2 ring-blue-500 scale-110 z-10 shadow-lg' : ''}`}>
                <div className="text-[10px] font-bold">
                  {lang === 'zh' ? '小' : lang === 'kk' ? 'К' : lang === 'ru' ? 'М' : 'P'}
                </div>
              </div>
            </div>
            
            {/* 拇指 */}
            <div className={`absolute bottom-4 -right-6 w-10 h-8 rounded-lg transition-all flex items-center justify-center ${
              getFingerColor('thumb-r', currentFinger === 'thumb-r')
            } ${currentFinger === 'thumb-r' ? 'ring-2 ring-purple-500 scale-110 z-10 shadow-lg' : ''}`}>
              <div className="text-[10px] font-bold">
                {lang === 'zh' ? '拇' : lang === 'kk' ? 'Б' : lang === 'ru' ? 'Б' : 'T'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 当前手指提示 */}
      {currentFinger && (
        <div className="mt-6 text-center p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
          <p className="text-sm font-semibold">
            {lang === 'zh' ? '使用手指' : lang === 'kk' ? 'Саусақ' : lang === 'ru' ? 'Палец' : 'Use Finger'}: 
            <span className={`ml-2 px-3 py-1 rounded font-bold ${
              currentFinger.includes('pinky') ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100' :
              currentFinger.includes('ring') ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100' :
              currentFinger.includes('middle') ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100' :
              currentFinger.includes('index') ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100' :
              'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100'
            }`}>
              {getFingerName(currentFinger)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

