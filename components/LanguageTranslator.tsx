'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface LanguageTranslatorProps {
  targetLanguage: 'english' | 'chinese' | 'kazakh' | 'russian' | 'other';
  onTranslate?: (enabled: boolean) => void;
}

const targetLangCodes: Record<string, string> = {
  english: 'en',
  chinese: 'zh',
  kazakh: 'kk',
  russian: 'ru',
  other: 'en', // 默认使用英语
};

export function LanguageTranslator({ targetLanguage, onTranslate }: LanguageTranslatorProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 找到主内容区域
    pageRef.current = document.querySelector('main') || document.body;
  }, []);

  const handleTranslate = async () => {
    if (isTranslated) {
      // 恢复原文
      setIsTranslated(false);
      setIsTranslating(false);
      onTranslate?.(false);
      
      if (pageRef.current) {
        const translatedElements = pageRef.current.querySelectorAll('[data-translated="true"]');
        translatedElements.forEach((el) => {
          const original = el.getAttribute('data-original');
          if (original) {
            el.textContent = original;
            el.removeAttribute('data-translated');
            el.removeAttribute('data-original');
          }
        });
      }
      return;
    }

    setIsTranslating(true);
    onTranslate?.(true);

    try {
      const targetCode = targetLangCodes[targetLanguage] || 'en';
      const container = pageRef.current || document.body;
      const elements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, label, strong, em, b, i') || [];
      
      const translateText = async (text: string): Promise<string> => {
        if (!text.trim() || text.length < 2) return text;
        
        // 跳过已经是目标语言的文本
        if (targetCode === 'en' && /^[a-zA-Z\s.,!?;:'"()-]+$/.test(text.trim())) {
          return text;
        }
        
        try {
          // 使用 Google Translate API (免费版本)
          const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`,
            { 
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data && data[0] && data[0][0] && data[0][0][0]) {
              return data[0][0][0];
            }
          }
        } catch (error) {
          console.error('Translation error:', error);
        }
        
        return text;
      };

      // 翻译所有文本节点（批量处理，避免过多请求）
      const textNodes: Array<{ element: HTMLElement; text: string }> = [];
      
      for (const element of Array.from(elements)) {
        const el = element as HTMLElement;
        // 跳过已经翻译的元素、按钮、链接、输入框
        if (
          el.getAttribute('data-translated') === 'true' ||
          el.closest('button, a[href], input, textarea, select, [data-no-translate]') ||
          el.querySelector('button, a[href], input')
        ) {
          continue;
        }
        
        const text = el.textContent?.trim() || '';
        if (text && text.length > 1 && text.length < 500) {
          textNodes.push({ element: el, text });
        }
      }

      // 批量翻译（每次翻译5个，避免API限制）
      for (let i = 0; i < textNodes.length; i += 5) {
        const batch = textNodes.slice(i, i + 5);
        await Promise.all(
          batch.map(async ({ element, text }) => {
            const translated = await translateText(text);
            if (translated !== text) {
              element.setAttribute('data-original', text);
              element.setAttribute('data-translated', 'true');
              element.textContent = translated;
            }
          })
        );
        // 添加小延迟避免API限制
        if (i + 5 < textNodes.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setIsTranslated(true);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const targetLangLabels: Record<string, string> = {
    english: '英语',
    chinese: '中文',
    kazakh: '哈萨克语',
    russian: '俄语',
    other: '其他',
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border-2 border-primary/30 shadow-md">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">🌐 {targetLangLabels[targetLanguage] || targetLanguage} 翻译</h3>
          <p className="text-sm text-muted-foreground">
            点击下方按钮，将整个页面内容翻译成 {targetLangLabels[targetLanguage] || targetLanguage}，帮助您更好地理解学习材料
          </p>
        </div>
        <Button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="shrink-0"
          variant={isTranslated ? 'outline' : 'default'}
          size="lg"
        >
          {isTranslating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              翻译中...
            </>
          ) : isTranslated ? (
            '↩️ 恢复原文'
          ) : (
            `🔤 翻译成${targetLangLabels[targetLanguage] || targetLanguage}`
          )}
        </Button>
      </div>
    </div>
  );
}

