"use client";
import { adsConfig } from '@/config/ads';
import { isPro } from '@/lib/auth';

type Position = 'global-header' | 'home-below-hero' | 'home-between-sections' | 'sidebar' | 'in-article' | 'footer';
type Variant = 'image' | 'html' | 'script' | 'affiliate-card';

export function MonetizeSlot({ position, className }: { position: Position; className?: string }) {
  const cfg = adsConfig[position];
  if (!cfg || !cfg.enabled) return null;
  if (isPro()) return null;

  const storageKey = `ad-hide-${position}`;
  const shouldHide = typeof window !== 'undefined' && localStorage.getItem(storageKey) === '1';
  const dismiss = () => {
    try {
      const days = 7;
      localStorage.setItem(storageKey, '1');
      // force re-render by navigating? rely on client only usage; noop on server
      if (typeof location !== 'undefined') location.reload();
    } catch {}
  };

  if (shouldHide && cfg.dismissible) return null;

  if (cfg.variant === 'affiliate-card') {
    return (
      <div className={className} aria-label={`ad-${position}`}>
        <a href={cfg.url || '#'} rel="noopener" className="block border rounded-lg p-4 hover:bg-accent" aria-label="Sponsored">
          <span className="text-xs text-muted-foreground">Sponsored</span>
        </a>
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">×</button>
        ) : null}
      </div>
    );
  }

  if (cfg.variant === 'image') {
    const img = cfg.img;
    return (
      <div className={className} aria-label={`ad-${position}`}>
        <a href={cfg.url || '#'} rel="noopener" className="block">
          <img src={img?.src} alt={img?.alt || 'ad'} width={img?.width} height={img?.height} className="w-full rounded" />
        </a>
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">×</button>
        ) : null}
      </div>
    );
  }

  if (cfg.variant === 'html') {
    return (
      <div className={className} aria-label={`ad-${position}`}>
        <div dangerouslySetInnerHTML={{ __html: cfg.html || '' }} />
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">×</button>
        ) : null}
      </div>
    );
  }

  if (cfg.variant === 'script') {
    return (
      <div className={className} aria-label={`ad-${position}`}>
        {/* script slot - replace in config if needed */}
        {cfg.dismissible ? (
          <button onClick={dismiss} className="mt-2 text-xs text-muted-foreground" aria-label="Hide">×</button>
        ) : null}
      </div>
    );
  }

  return null;
}




