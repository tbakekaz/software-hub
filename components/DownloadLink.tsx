'use client';

import { useState, useEffect } from 'react';
import type { SVGProps } from 'react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

function ExternalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

type HealthStatus = 'checking' | 'healthy' | 'slow' | 'error' | null;

interface DownloadLinkProps {
  href: string;
  label: string;
  secondary?: string;
  className?: string;
  showHealthCheck?: boolean;
  isMirror?: boolean;
}

export function DownloadLink({ href, label, secondary, className, showHealthCheck = false, isMirror = false }: DownloadLinkProps) {
  const [copied, setCopied] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(null);
  const [healthMessage, setHealthMessage] = useState<string>('');

  useEffect(() => {
    if (!showHealthCheck || !href) return;
    setHealthStatus('checking');
    setHealthMessage('检测中...');

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(href, { method: 'HEAD', signal: controller.signal, mode: 'no-cors' })
        .then(() => {
          setHealthStatus('healthy');
          setHealthMessage(isMirror ? '镜像可用' : '链接正常');
        })
        .catch(() => {
          setHealthStatus('slow');
          setHealthMessage(isMirror ? '镜像可能较慢' : '链接可能较慢');
        });
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [href, showHealthCheck, isMirror]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('[DownloadLink] copy failed', error);
    }
  };

  const getHealthIcon = () => {
    if (healthStatus === 'healthy') {
      return <CheckIcon className="h-3 w-3 text-green-600" />;
    }
    if (healthStatus === 'slow' || healthStatus === 'error') {
      return <AlertIcon className="h-3 w-3 text-yellow-600" />;
    }
    return null;
  };

  return (
    <div className={clsx('flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2', className)}>
      <div className="flex-1 min-w-0">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ExternalIcon className="h-3.5 w-3.5" />
          <span className="truncate" title={href}>{label}</span>
        </a>
        <div className="flex items-center gap-2 mt-1">
          {secondary ? <div className="text-xs text-muted-foreground">{secondary}</div> : null}
          {showHealthCheck && healthStatus && (
            <div className="flex items-center gap-1 text-xs">
              {getHealthIcon()}
              <span className={clsx(
                healthStatus === 'healthy' ? 'text-green-600' : 'text-yellow-600'
              )}>
                {healthMessage}
              </span>
            </div>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleCopy} type="button" aria-label="复制下载链接">
        <CopyIcon className="h-4 w-4" />
      </Button>
      {copied ? <span className="text-xs text-green-600">已复制</span> : null}
    </div>
  );
}
