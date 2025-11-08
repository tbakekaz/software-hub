"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAffiliateUrl } from '@/lib/affiliate';
import type { DownloadSource } from '@/lib/content';

type DownloadItem = {
  platform: string;
  version?: string;
  url?: string;
  mirrorUrls?: string[];
  sources?: DownloadSource[];
};

type Props = {
  downloads: DownloadItem[];
  slug: string;
  latestVersion: string;
  dict: {
    software: {
      downloadFrom: string;
      source123pan: string;
      sourceR2: string;
      sourceOther: string;
      version: string;
      latest: string;
    };
  };
};

export function VersionDownloads({ downloads, slug, latestVersion, dict }: Props) {
  // 按版本分组
  const groupedByVersion = downloads.reduce((acc, d) => {
    const version = d.version || latestVersion;
    if (!acc[version]) acc[version] = [];
    acc[version].push(d);
    return acc;
  }, {} as Record<string, DownloadItem[]>);

  // 获取版本列表，按版本号降序排列
  const versions = Object.keys(groupedByVersion).sort((a, b) => {
    // 尝试按数字排序，如果不是数字则按字符串排序
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numB - numA; // 降序
    }
    return b.localeCompare(a);
  });

  // 默认展开最新版本
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set(versions.length > 0 ? [versions[0]] : [])
  );

  const toggleVersion = (version: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

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
  const getDownloadSources = (d: DownloadItem) => {
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

  if (versions.length === 0) return null;

  return (
    <div className="space-y-3">
      {versions.map((version) => {
        const versionDownloads = groupedByVersion[version];
        const isExpanded = expandedVersions.has(version);
        const isLatest = version === latestVersion;

        return (
          <div key={version} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleVersion(version)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {dict.software.version} {version}
                </span>
                {isLatest && (
                  <Badge className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border-0">
                    {dict.software.latest}
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground text-sm">
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
            
            {isExpanded && (
              <div className="p-4 pt-0 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {versionDownloads.map((d) => {
                    const sources = getDownloadSources(d);
                    if (sources.length === 0) return null;

                    return (
                      <div key={d.platform} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs px-2 py-1 capitalize bg-transparent border">
                            {d.platform}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={getAffiliateUrl(source.url, { source: 'site', campaign: 'download', slug })}
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
            )}
          </div>
        );
      })}
    </div>
  );
}



