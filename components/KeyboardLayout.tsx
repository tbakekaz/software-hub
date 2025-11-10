'use client';

import { useState, useEffect } from 'react';
import type { Lang } from '@/lib/i18n';

interface KeyboardLayoutProps {
  currentKey?: string;
  language?: 'kazakh' | 'chinese' | 'russian' | 'english';
  lang?: Lang;
  showFingerHints?: boolean;
}

// 标准 QWERTY 键盘布局
const qwertyLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

// 手指映射（用于显示颜色提示）
const fingerMap: Record<string, string> = {
  // 左手
  '`': 'pinky-l', '1': 'pinky-l', '2': 'ring-l', '3': 'middle-l', '4': 'index-l', '5': 'index-l',
  'Tab': 'pinky-l', 'Q': 'pinky-l', 'W': 'ring-l', 'E': 'middle-l', 'R': 'index-l', 'T': 'index-l',
  'Caps': 'pinky-l', 'A': 'pinky-l', 'S': 'ring-l', 'D': 'middle-l', 'F': 'index-l', 'G': 'index-l',
  'Shift': 'pinky-l', 'Z': 'pinky-l', 'X': 'ring-l', 'C': 'middle-l', 'V': 'index-l', 'B': 'index-l',
  'Ctrl': 'pinky-l', 'Win': 'pinky-l', 'Alt': 'thumb-l',
  
  // 右手
  '6': 'index-r', '7': 'index-r', '8': 'middle-r', '9': 'ring-r', '0': 'pinky-r', '-': 'pinky-r', '=': 'pinky-r',
  'Y': 'index-r', 'U': 'index-r', 'I': 'middle-r', 'O': 'ring-r', 'P': 'pinky-r', '[': 'pinky-r', ']': 'pinky-r', '\\': 'pinky-r',
  'H': 'index-r', 'J': 'index-r', 'K': 'middle-r', 'L': 'ring-r', ';': 'pinky-r', "'": 'pinky-r',
  'N': 'index-r', 'M': 'index-r', ',': 'middle-r', '.': 'ring-r', '/': 'pinky-r',
  'Space': 'thumb-r',
};

// 手指颜色
const fingerColors: Record<string, string> = {
  'pinky-l': 'bg-blue-200 dark:bg-blue-800',
  'ring-l': 'bg-green-200 dark:bg-green-800',
  'middle-l': 'bg-yellow-200 dark:bg-yellow-800',
  'index-l': 'bg-red-200 dark:bg-red-800',
  'thumb-l': 'bg-purple-200 dark:bg-purple-800',
  'index-r': 'bg-red-200 dark:bg-red-800',
  'middle-r': 'bg-yellow-200 dark:bg-yellow-800',
  'ring-r': 'bg-green-200 dark:bg-green-800',
  'pinky-r': 'bg-blue-200 dark:bg-blue-800',
  'thumb-r': 'bg-purple-200 dark:bg-purple-800',
};

export function KeyboardLayout({ currentKey, language = 'english', lang = 'zh', showFingerHints = true }: KeyboardLayoutProps) {
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  useEffect(() => {
    if (currentKey) {
      // 将小写转换为大写以匹配布局
      const key = currentKey.toUpperCase();
      setHighlightedKey(key);
    } else {
      setHighlightedKey(null);
    }
  }, [currentKey]);

  // 获取当前字符对应的手指
  const getCurrentFinger = (key: string | null): string | null => {
    if (!key) return null;
    const upperKey = key.toUpperCase();
    return fingerMap[upperKey] || null;
  };

  const currentFinger = getCurrentFinger(currentKey || null);

  const getKeyClass = (key: string): string => {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium transition-all';
    const finger = fingerMap[key] || '';
    const fingerColor = showFingerHints && finger ? fingerColors[finger] : '';
    
    let highlightClass = '';
    if (highlightedKey && key.toUpperCase() === highlightedKey.toUpperCase()) {
      // 当前按键：明显的红色高亮（参考 typingstudy.com）
      highlightClass = 'ring-2 ring-red-500 bg-red-200 dark:bg-red-800 scale-110 font-bold text-red-900 dark:text-red-100';
    } else if (showFingerHints && fingerColor) {
      highlightClass = fingerColor;
    } else {
      highlightClass = 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
    }

    // 特殊键样式
    if (['Tab', 'Caps', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space'].includes(key)) {
      return `${baseClass} ${highlightClass} min-w-[60px] text-[10px]`;
    }

    return `${baseClass} ${highlightClass} min-w-[32px]`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-1">
        {qwertyLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => {
              // 处理 Space 键
              if (key === 'Space') {
                return (
                  <div
                    key={key}
                    className={getKeyClass(key)}
                    style={{ minWidth: '200px' }}
                  >
                    {lang === 'zh' ? '空格' : lang === 'kk' ? 'Бос орын' : lang === 'ru' ? 'Пробел' : 'Space'}
                  </div>
                );
              }
              
              return (
                <div key={key} className={getKeyClass(key)}>
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* 当前手指提示（参考 typingstudy.com） */}
      {currentKey && currentFinger && (
        <div className="mt-4 text-center p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
          <p className="text-sm font-semibold mb-1">
            {lang === 'zh' ? '使用手指' : lang === 'kk' ? 'Саусақ' : lang === 'ru' ? 'Палец' : 'Use Finger'}: 
            <span className={`ml-2 px-3 py-1 rounded font-bold ${
              currentFinger === 'pinky-l' || currentFinger === 'pinky-r' ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100' :
              currentFinger === 'ring-l' || currentFinger === 'ring-r' ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100' :
              currentFinger === 'middle-l' || currentFinger === 'middle-r' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100' :
              currentFinger === 'index-l' || currentFinger === 'index-r' ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100' :
              'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100'
            }`}>
              {currentFinger === 'pinky-l' || currentFinger === 'pinky-r' ? 
                (lang === 'zh' ? '小指' : lang === 'kk' ? 'Кішкентай саусақ' : lang === 'ru' ? 'Мизинец' : 'Pinky') :
              currentFinger === 'ring-l' || currentFinger === 'ring-r' ?
                (lang === 'zh' ? '无名指' : lang === 'kk' ? 'Анонимдік саусақ' : lang === 'ru' ? 'Безымянный' : 'Ring') :
              currentFinger === 'middle-l' || currentFinger === 'middle-r' ?
                (lang === 'zh' ? '中指' : lang === 'kk' ? 'Орта саусақ' : lang === 'ru' ? 'Средний' : 'Middle') :
              currentFinger === 'index-l' || currentFinger === 'index-r' ?
                (lang === 'zh' ? '食指' : lang === 'kk' ? 'Сайыс саусақ' : lang === 'ru' ? 'Указательный' : 'Index') :
              (lang === 'zh' ? '拇指' : lang === 'kk' ? 'Бас бармақ' : lang === 'ru' ? 'Большой' : 'Thumb')
              }
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === 'zh' ? '当前按键' : lang === 'kk' ? 'Ағымдағы перне' : lang === 'ru' ? 'Текущая клавиша' : 'Current Key'}: <span className="font-mono font-bold">{currentKey}</span>
          </p>
        </div>
      )}

      {showFingerHints && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-800"></div>
            <span>{lang === 'zh' ? '小指' : lang === 'kk' ? 'Кішкентай саусақ' : lang === 'ru' ? 'Мизинец' : 'Pinky'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-800"></div>
            <span>{lang === 'zh' ? '无名指' : lang === 'kk' ? 'Анонимдік саусақ' : lang === 'ru' ? 'Безымянный' : 'Ring'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-200 dark:bg-yellow-800"></div>
            <span>{lang === 'zh' ? '中指' : lang === 'kk' ? 'Орта саусақ' : lang === 'ru' ? 'Средний' : 'Middle'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-200 dark:bg-red-800"></div>
            <span>{lang === 'zh' ? '食指' : lang === 'kk' ? 'Сайыс саусақ' : lang === 'ru' ? 'Указательный' : 'Index'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-200 dark:bg-purple-800"></div>
            <span>{lang === 'zh' ? '拇指' : lang === 'kk' ? 'Бас бармақ' : lang === 'ru' ? 'Большой' : 'Thumb'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

