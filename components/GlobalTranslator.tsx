'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function GlobalTranslator() {
  const [currentLang, setCurrentLang] = useState<string>('zh');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 从 cookie 或路径获取当前语言
    const cookieLang = document.cookie.match(/lang=([^;]+)/)?.[1] || 'zh';
    const pathLang = pathname?.startsWith('/kk') ? 'kk' : 
                     pathname?.startsWith('/ru') ? 'ru' : 
                     pathname?.startsWith('/en') ? 'en' : 
                     pathname?.startsWith('/zh') ? 'zh' : cookieLang;
    setCurrentLang(pathLang);
  }, [pathname]);

  const handleTranslate = async () => {
    if (isTranslated) {
      // 恢复原文
      setIsTranslated(false);
      setIsTranslating(false);
      
      const allTranslatedElements = document.querySelectorAll('[data-translated="true"]');
      allTranslatedElements.forEach((el) => {
        const original = el.getAttribute('data-original');
        if (original) {
          el.textContent = original;
          el.removeAttribute('data-translated');
          el.removeAttribute('data-original');
        }
      });
      return;
    }

    setIsTranslating(true);

    try {
      const targetCode = currentLang === 'zh' ? 'zh' : currentLang === 'kk' ? 'kk' : currentLang === 'ru' ? 'ru' : 'en';
      const elements = document.body.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, label, strong, em, b, i, a, button') || [];
      
      const translateText = async (text: string): Promise<string> => {
        if (!text.trim() || text.length < 2) return text;
        
        try {
          const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`,
            { 
              method: 'GET',
              headers: { 'Accept': 'application/json' }
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

      const textNodes: Array<{ element: HTMLElement; text: string }> = [];
      
      for (const element of Array.from(elements)) {
        const el = element as HTMLElement;
        if (
          el.getAttribute('data-translated') === 'true' ||
          el.closest('input, textarea, select, [data-no-translate]') ||
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT'
        ) {
          continue;
        }
        
        const shouldTranslate = el.tagName === 'A' || 
                                el.tagName === 'BUTTON' ||
                                (!el.closest('a, button') && el.textContent);
        
        if (shouldTranslate) {
          const text = el.textContent?.trim() || '';
          if (text && text.length > 1 && text.length < 500) {
            const hasOnlyTextChildren = Array.from(el.childNodes).every(
              node => node.nodeType === Node.TEXT_NODE || 
              (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'SPAN' && !(node as HTMLElement).querySelector('*'))
            );
            
            if (hasOnlyTextChildren || el.tagName === 'A' || el.tagName === 'BUTTON') {
              textNodes.push({ element: el, text });
            }
          }
        }
      }

      // 批量翻译
      for (let i = 0; i < textNodes.length; i += 3) {
        const batch = textNodes.slice(i, i + 3);
        await Promise.all(
          batch.map(async ({ element, text }) => {
            const translated = await translateText(text);
            if (translated !== text && translated.trim()) {
              const originalHTML = element.innerHTML;
              element.setAttribute('data-original', text);
              element.setAttribute('data-original-html', originalHTML);
              element.setAttribute('data-translated', 'true');
              
              if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                const hasChildElements = Array.from(element.childNodes).some(
                  node => node.nodeType === Node.ELEMENT_NODE
                );
                
                if (hasChildElements) {
                  Array.from(element.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                      node.textContent = translated;
                    }
                  });
                } else {
                  element.textContent = translated;
                }
              } else {
                element.textContent = translated;
              }
            }
          })
        );
        if (i + 3 < textNodes.length) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }

      setIsTranslated(true);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const langLabels: Record<string, string> = {
    zh: '中文',
    kk: '哈萨克语',
    ru: '俄语',
    en: '英语',
  };

  return (
    <Button
      onClick={handleTranslate}
      disabled={isTranslating}
      variant={isTranslated ? 'outline' : 'default'}
      size="sm"
      className="text-xs"
    >
      {isTranslating ? (
        <>
          <span className="animate-spin mr-1">⏳</span>
          翻译中...
        </>
      ) : isTranslated ? (
        '↩️ 恢复原文'
      ) : (
        `🌐 翻译成${langLabels[currentLang] || currentLang}`
      )}
    </Button>
  );
}

