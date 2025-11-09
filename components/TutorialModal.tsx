"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAffiliateUrl } from '@/lib/affiliate';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { TutorialMeta, Software, DownloadSource } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

type Props = {
  tutorial: TutorialMeta | null;
  content: string;
  lang: Lang;
  dict: {
    software: {
      download: string;
      downloadFrom: string;
      source123pan: string;
      sourceR2: string;
      sourceOther: string;
      version: string;
      latest: string;
    };
  };
  onClose: () => void;
};

export function TutorialModal({ tutorial, content, lang, dict, onClose }: Props) {
  const [software, setSoftware] = useState<Software | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // 防止背景滚动
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, []);

  // 加载关联的软件信息
  useEffect(() => {
    if (tutorial?.softwareSlug) {
      fetch(`/api/software/${tutorial.softwareSlug}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            setSoftware(data);
          }
        })
        .catch(err => {
          console.error('Failed to load software:', err);
        });
    }
  }, [tutorial?.softwareSlug]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!tutorial || !mounted) return null;

  const title = pickLocaleString(tutorial.title_i18n || tutorial.title, lang);
  const summary = pickLocaleString(tutorial.summary_i18n || tutorial.summary, lang);

  // 获取下载源标签
  const getSourceLabel = (source: DownloadSource) => {
    if (source.label) return source.label;
    switch (source.type) {
      case '123pan':
        return dict.software.source123pan;
      case 'r2':
        return dict.software.sourceR2;
      default:
        return dict.software.sourceOther;
    }
  };

  // 处理下载源
  const getDownloadSources = (d: Software['downloads'][0]) => {
    const sources: { url: string; label: string }[] = [];
    
    if (d.sources && d.sources.length > 0) {
      const pan123 = d.sources.find(s => s.type === '123pan');
      const r2 = d.sources.find(s => s.type === 'r2');
      
      if (pan123) {
        sources.push({ url: pan123.url, label: getSourceLabel(pan123) });
      }
      if (r2) {
        sources.push({ url: r2.url, label: getSourceLabel(r2) });
      }
      
      d.sources.forEach(source => {
        if (source.type !== '123pan' && source.type !== 'r2') {
          sources.push({ url: source.url, label: getSourceLabel(source) });
        }
      });
    } else {
      if (d.url) {
        sources.push({ url: d.url, label: dict.software.source123pan });
      }
      if (d.mirrorUrls && d.mirrorUrls.length > 0) {
        d.mirrorUrls.forEach(url => {
          sources.push({ url, label: dict.software.sourceR2 });
        });
      }
    }
    
    return sources;
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-background border rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {summary && (
              <p className="text-sm text-muted-foreground mt-1">{summary}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 下载按钮区域 */}
          {software && software.downloads && software.downloads.length > 0 && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-medium mb-4">{dict.software.download}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {software.downloads.map((d, idx) => {
                  const sources = getDownloadSources(d);
                  if (sources.length === 0) return null;

                  return (
                    <div key={idx} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs px-2 py-1 capitalize bg-transparent border">
                          {d.platform}
                        </Badge>
                        {d.version && (
                          <Badge className="text-xs px-2 py-1 bg-transparent border">
                            v{d.version}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        {sources.map((source, sourceIdx) => (
                          <a
                            key={sourceIdx}
                            href={getAffiliateUrl(source.url, { source: 'site', campaign: 'download', slug: software.slug })}
                            target="_blank"
                            rel="noopener"
                            className="block"
                          >
                            <Button 
                              className="w-full" 
                              size="sm"
                              variant={sourceIdx === 0 ? "default" : "outline"}
                            >
                              {dict.software.downloadFrom.replace('{source}', source.label)}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 教程内容 */}
          <article className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
}

