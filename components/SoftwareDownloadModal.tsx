"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAffiliateUrl } from '@/lib/affiliate';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { DownloadSource, Software } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

type Props = {
  software: Software | null;
  lang: Lang;
  dict: {
    software: {
      downloadFrom: string;
      source123pan: string;
      sourceR2: string;
      sourceOther: string;
      version: string;
      latest: string;
      download: string;
    };
  };
  onClose: () => void;
};

export function SoftwareDownloadModal({ software, lang, dict, onClose }: Props) {
  // 使用 Portal 渲染到 body（仅在客户端）
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // 调试：仅在开发环境显示（可选）
  useEffect(() => {
    if (software && process.env.NODE_ENV === 'development') {
      const groupedByVersion = software.downloads.reduce((acc, d) => {
        const version = d.version || software.version;
        if (!acc[version]) acc[version] = [];
        acc[version].push(d);
        return acc;
      }, {} as Record<string, typeof software.downloads>);
      const versionKeys = Object.keys(groupedByVersion);
      console.log(`[SoftwareDownloadModal] ${software.name}: ${versionKeys.length} 个版本, ${software.downloads.length} 个下载项`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [software?.slug, software?.downloads.length]);

  if (!software || !mounted) return null;

  const name = pickLocaleString(software.name_i18n || software.name, lang);
  const desc = pickLocaleString(software.description_i18n || software.description, lang);

  // 按版本分组
  const groupedByVersion = software.downloads.reduce((acc, d) => {
    // 确保使用下载项中的 version 字段，如果没有则使用软件顶层 version
    const version = d.version || software.version;
    if (!acc[version]) acc[version] = [];
    acc[version].push(d);
    return acc;
  }, {} as Record<string, typeof software.downloads>);

  // 获取版本列表，按版本号降序排列
  const versions = Object.keys(groupedByVersion).sort((a, b) => {
    // 尝试按数字排序（适用于年份版本如 2025, 2024）
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numB - numA; // 降序：最新版本在前
    }
    // 尝试按语义版本排序（如 1.2.3）
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);
    if (partsA.length === partsB.length && partsA.every((n, i) => !isNaN(n) && !isNaN(partsB[i]))) {
      for (let i = 0; i < partsA.length; i++) {
        if (partsB[i] !== partsA[i]) {
          return partsB[i] - partsA[i]; // 降序
        }
      }
    }
    // 其他情况按字符串降序
    return b.localeCompare(a);
  });


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
  const getDownloadSources = (d: typeof software.downloads[0]) => {
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
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
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
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{dict.software.download}</h3>
            {versions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  共 {versions.length} 个版本
                </span>
                {process.env.NODE_ENV === 'development' && (
                  <span className="text-xs text-muted-foreground/70">
                    ({software.downloads.length} 个下载项)
                  </span>
                )}
              </div>
            )}
          </div>
          
          {versions.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无下载选项</p>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => {
                const versionDownloads = groupedByVersion[version];
                const isLatest = version === software.version;

                // 确保版本有下载项
                if (!versionDownloads || versionDownloads.length === 0) {
                  return null;
                }

                // 确保版本有有效的下载源
                const validDownloads = versionDownloads.filter(d => {
                  const sources = getDownloadSources(d);
                  return sources.length > 0;
                });

                if (validDownloads.length === 0) {
                  return null;
                }

                return (
                  <div key={version} className="border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <span className="font-semibold text-base">
                        {dict.software.version} {version}
                      </span>
                      {isLatest && (
                        <Badge className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border-0">
                          {dict.software.latest}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {validDownloads.map((d) => {
                        const sources = getDownloadSources(d);
                        if (sources.length === 0) return null;

                        return (
                          <div key={`${version}-${d.platform}`} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Badge className="text-xs px-2 py-1 capitalize bg-transparent border">
                                {d.platform}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {sources.map((source, idx) => (
                                <a
                                  key={idx}
                                  href={getAffiliateUrl(source.url, { source: 'site', campaign: 'download', slug: software.slug })}
                                  target="_blank"
                                  rel="noopener"
                                  className="block"
                                >
                                  <Button 
                                    className="w-full" 
                                    size="sm"
                                    variant={idx === 0 ? "default" : "outline"}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
}

