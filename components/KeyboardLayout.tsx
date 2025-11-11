'use client';

import { useState, useEffect } from 'react';
import type { Lang } from '@/lib/i18n';
import { Hand } from './HandsFingerGuide';

interface KeyboardLayoutProps {
  currentKey?: string;
  language?: 'kazakh' | 'chinese' | 'russian' | 'english';
  lang?: Lang;
  showFingerHints?: boolean;
}

// 标准 QWERTY 键盘布局（英语/中文）
const qwertyLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

// 哈萨克语键盘布局（基于西里尔字母，QWERTY布局，包含哈萨克语特有字母）
// 哈萨克语特有字母：Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І
const kazakhLayout = [
  ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '\\'],
  ['Caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', '.', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

// 俄语键盘布局（ЙЦУКЕН）
const russianLayout = [
  ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '\\'],
  ['Caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', '.', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

// 获取键盘布局
const getKeyboardLayout = (language: 'kazakh' | 'chinese' | 'russian' | 'english') => {
  switch (language) {
    case 'kazakh':
      return kazakhLayout;
    case 'russian':
      return russianLayout;
    case 'chinese':
    case 'english':
    default:
      return qwertyLayout;
  }
};

// 手指映射（用于显示颜色提示）- 支持多语言
const fingerMap: Record<string, string> = {
  // 左手 - QWERTY
  '`': 'pinky-l', '1': 'pinky-l', '2': 'ring-l', '3': 'middle-l', '4': 'index-l', '5': 'index-l',
  'Tab': 'pinky-l', 'Q': 'pinky-l', 'W': 'ring-l', 'E': 'middle-l', 'R': 'index-l', 'T': 'index-l',
  'Caps': 'pinky-l', 'A': 'pinky-l', 'S': 'ring-l', 'D': 'middle-l', 'F': 'index-l', 'G': 'index-l',
  'Shift': 'pinky-l', 'Z': 'pinky-l', 'X': 'ring-l', 'C': 'middle-l', 'V': 'index-l', 'B': 'index-l',
  'Ctrl': 'pinky-l', 'Win': 'pinky-l', 'Alt': 'thumb-l',
  
  // 右手 - QWERTY
  '6': 'index-r', '7': 'index-r', '8': 'middle-r', '9': 'ring-r', '0': 'pinky-r', '-': 'pinky-r', '=': 'pinky-r',
  'Y': 'index-r', 'U': 'index-r', 'I': 'middle-r', 'O': 'ring-r', 'P': 'pinky-r', '[': 'pinky-r', ']': 'pinky-r', '\\': 'pinky-r',
  'H': 'index-r', 'J': 'index-r', 'K': 'middle-r', 'L': 'ring-r', ';': 'pinky-r', "'": 'pinky-r',
  'N': 'index-r', 'M': 'index-r', ',': 'middle-r', '.': 'ring-r', '/': 'pinky-r',
  'Space': 'thumb-r',
  
  // 哈萨克语/俄语键盘 - 第一行
  'ё': 'pinky-l',
  // 第二行：Й Ц У К Е Н Г Ш Щ З Х Ъ
  'Й': 'pinky-l', 'Ц': 'ring-l', 'У': 'middle-l', 'К': 'index-l', 'Е': 'index-l',
  'Н': 'index-r', 'Г': 'index-r', 'Ш': 'middle-r', 'Щ': 'ring-r', 'З': 'pinky-r', 'Х': 'pinky-r', 'Ъ': 'pinky-r',
  // 第三行：Ф Ы В А П Р О Л Д Ж Э
  'Ф': 'pinky-l', 'Ы': 'ring-l', 'В': 'middle-l', 'А': 'index-l', 'П': 'index-l',
  'Р': 'index-r', 'О': 'index-r', 'Л': 'middle-r', 'Д': 'ring-r', 'Ж': 'pinky-r', 'Э': 'pinky-r',
  // 第四行：Я Ч С М И Т Ь Б Ю
  'Я': 'pinky-l', 'Ч': 'ring-l', 'С': 'middle-l', 'М': 'index-l', 'И': 'index-l',
  'Т': 'index-r', 'Ь': 'middle-r', 'Б': 'ring-r', 'Ю': 'pinky-r',
  
  // 哈萨克语特有字母（Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І）
  // 这些字母通常分布在键盘的不同位置，根据常见布局分配手指
  'Ә': 'ring-l', 'Ғ': 'ring-l', 'Қ': 'index-l', 'Ң': 'index-l',
  'Ө': 'index-r', 'Ұ': 'index-r', 'Ү': 'middle-r', 'Һ': 'ring-r', 'І': 'pinky-r',
  // 小写版本
  'ә': 'ring-l', 'ғ': 'ring-l', 'қ': 'index-l', 'ң': 'index-l',
  'ө': 'index-r', 'ұ': 'index-r', 'ү': 'middle-r', 'һ': 'ring-r', 'і': 'pinky-r',
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
  const keyboardLayout = getKeyboardLayout(language);

  useEffect(() => {
    if (currentKey) {
      // 对于西里尔字母，保持原样；对于拉丁字母，转换为大写
      const key = (language === 'kazakh' || language === 'russian') 
        ? currentKey 
        : currentKey.toUpperCase();
      setHighlightedKey(key);
    } else {
      setHighlightedKey(null);
    }
  }, [currentKey, language]);

  // 获取当前字符对应的手指
  const getCurrentFinger = (key: string | null): string | null => {
    if (!key) return null;
    // 对于西里尔字母，直接查找；对于拉丁字母，转换为大写
    const lookupKey = (language === 'kazakh' || language === 'russian')
      ? key
      : key.toUpperCase();
    return fingerMap[lookupKey] || null;
  };

  const currentFinger = getCurrentFinger(currentKey || null);

  const getKeyClass = (key: string): string => {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium transition-all';
    // 查找手指映射（支持大小写不敏感）
    const lookupKey = (language === 'kazakh' || language === 'russian')
      ? key
      : key.toUpperCase();
    const finger = fingerMap[lookupKey] || fingerMap[key] || '';
    const fingerColor = showFingerHints && finger ? fingerColors[finger] : '';
    
    let highlightClass = '';
    // 高亮匹配（支持大小写不敏感和西里尔字母）
    const isHighlighted = highlightedKey && (
      key === highlightedKey || 
      key.toUpperCase() === highlightedKey.toUpperCase() ||
      key.toLowerCase() === highlightedKey.toLowerCase()
    );
    
    if (isHighlighted) {
      // 当前按键：绿色高亮（参考 typingstudy.com）
      highlightClass = 'ring-2 ring-green-500 bg-green-400 dark:bg-green-600 scale-110 font-bold text-white shadow-lg';
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
    <div className="w-full max-w-6xl mx-auto">
      {/* 键盘和双手布局（参考 typingstudy.com） */}
      <div className="flex items-center justify-center gap-4">
        {/* 左手 - 放在键盘左边 */}
        <div className="flex-shrink-0">
          <Hand hand="left" currentFinger={currentFinger} lang={lang} />
        </div>
        
        {/* 键盘布局 */}
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
        {keyboardLayout.map((row, rowIndex) => (
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
              
              // 处理特殊键（保持英文显示）
              if (['Tab', 'Caps', 'Shift', 'Ctrl', 'Win', 'Alt'].includes(key)) {
                return (
                  <div key={key} className={getKeyClass(key)}>
                    {key}
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

        {/* 手指颜色图例 */}
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
        
        {/* 右手 - 放在键盘右边 */}
        <div className="flex-shrink-0">
          <Hand hand="right" currentFinger={currentFinger} lang={lang} />
        </div>
      </div>
    </div>
  );
}

