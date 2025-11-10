"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { adsConfig } from '@/config/ads';
import { isPro } from '@/lib/auth';

const HIDE_DURATION = 24 * 60 * 60 * 1000; // 24 小时

export type Position = 'global-header' | 'home-below-hero' | 'home-between-sections' | 'sidebar' | 'in-article' | 'footer';
export type Variant = 'image' | 'html' | 'script' | 'affiliate-card';

type Props = { position: Position; className?: string };

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export function MonetizeSlot({ position, className }: Props) {
  const cfg = adsConfig[position];
  const [hiddenUntil, setHiddenUntil] = useState<number | null>(null);
  const storageKey = `ad-hide-${position}`;

  useEffect(() => {
    if (!cfg?.dismissible) return;
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    const value = Number(stored);
    if (!Number.isNaN(value) && value > Date.now()) {
      setHiddenUntil(value);
    }
  }, [cfg?.dismissible, storageKey]);

  useEffect(() => {
    if (!hiddenUntil) return;
    const remaining = hiddenUntil - Date.now();
    if (remaining <= 0) {
      setHiddenUntil(null);
      return;
    }
    const timer = window.setTimeout(() => setHiddenUntil(null), remaining);
    return () => window.clearTimeout(timer);
  }, [hiddenUntil]);

  const dismiss = useCallback(() => {
    if (!cfg?.dismissible) return;
    if (typeof window === 'undefined') return;
    const expiresAt = Date.now() + HIDE_DURATION;
    try {
      window.localStorage.setItem(storageKey, String(expiresAt));
      setHiddenUntil(expiresAt);
    } catch (error) {
      console.warn('[MonetizeSlot] Failed to persist dismissal state', error);
    }
  }, [cfg?.dismissible, storageKey]);

  const shouldHide = useMemo(() => {
    if (!cfg || !cfg.enabled) return true;
    if (isPro()) return true;
    if (!cfg.dismissible) return false;
    if (!hiddenUntil) return false;
    return hiddenUntil > Date.now();
  }, [cfg, hiddenUntil]);

  useEffect(() => {
    if (!cfg || cfg.variant !== 'script') return;
    if (shouldHide) return;
    const push = () => {
      try {
        if (typeof window === 'undefined') return;
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }
        window.adsbygoogle.push({});
      } catch (error) {
        console.warn('[MonetizeSlot] Failed to push AdSense slot', error);
      }
    };
    const timer = window.setTimeout(push, 150);
    return () => window.clearTimeout(timer);
  }, [cfg, shouldHide, hiddenUntil]);

  if (!cfg || !cfg.enabled) return null;
  if (isPro()) return null;
  if (shouldHide) return null;

  if (cfg.variant === 'affiliate-card') {
    return (
      <div className={className} aria-label={`ad-${position}`}>
        <a href={cfg.url || '#'} rel="noopener" className="block border rounded-lg p-4 hover:bg-accent transition">
          <span className="text-xs text-muted-foreground">Sponsored</span>
        </a>
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">
            ×
          </button>
        ) : null}
      </div>
    );
  }

  if (cfg.variant === 'image') {
    const img = cfg.img;
    if (!img?.src) return null;
    return (
      <div className={className} aria-label={`ad-${position}`}>
        <a href={cfg.url || '#'} rel="noopener" className="block">
          <Image
            src={img.src}
            alt={img.alt || 'ad'}
            width={img.width || 728}
            height={img.height || 90}
            className="w-full rounded"
            loading="lazy"
            unoptimized={img.src.startsWith('/')}
          />
        </a>
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">
            ×
          </button>
        ) : null}
      </div>
    );
  }

  if (cfg.variant === 'html') {
    return (
      <div className={className} aria-label={`ad-${position}`}>
        <div dangerouslySetInnerHTML={{ __html: cfg.html || '' }} />
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">
            ×
          </button>
        ) : null}
      </div>
    );
  }

  if (cfg.variant === 'script') {
    const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

    if (!adSenseId) {
      if (cfg.script) {
        return (
          <div className={className} aria-label={`ad-${position}`}>
            <div dangerouslySetInnerHTML={{ __html: cfg.script }} />
            {cfg.dismissible ? (
              <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">
                ×
              </button>
            ) : null}
          </div>
        );
      }
      return null;
    }

    return (
      <div className={className} aria-label={`ad-${position}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adSenseId}
          data-ad-slot={cfg.adSlot || undefined}
          data-ad-format={cfg.adFormat || 'auto'}
          data-full-width-responsive={cfg.responsive !== false ? 'true' : 'false'}
        />
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">
            ×
          </button>
        ) : null}
      </div>
    );
  }

  return null;
}




