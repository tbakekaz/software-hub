"use client";

import Link from 'next/link';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cardTokens, skeletonTokens } from '@/lib/design-tokens';

export type CardBaseProps = {
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: ReactNode;
  compact?: boolean;
  isLoading?: boolean;
} & ComponentPropsWithoutRef<'div'>;

export function CardBase({
  href,
  target,
  rel,
  className,
  children,
  compact,
  isLoading,
  ...rest
}: CardBaseProps) {
  const baseClass = clsx(compact ? cardTokens.compactContainer : cardTokens.container, cardTokens.padding, className, {
    'pointer-events-none opacity-75': isLoading,
  });

  const content = (
    <div className={baseClass} {...rest}>
      {isLoading ? <CardSkeleton /> : children}
    </div>
  );

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target={target ?? '_blank'}
          rel={rel ?? 'noopener noreferrer'}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl"
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx(cardTokens.header, className)}>{children}</div>;
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx(cardTokens.body, className)}>{children}</div>;
}

export function CardBadge({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={clsx(cardTokens.badge, className)}>{children}</span>;
}

export function CardMeta({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx(cardTokens.meta, className)}>{children}</div>;
}

export function CardCTA({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={clsx(cardTokens.ctaLink, className)}>{children}</span>;
}

export function CardSkeleton() {
  return (
    <div className={clsx('space-y-3', skeletonTokens.base)}>
      <div className="flex items-center justify-between gap-3">
        <div className={clsx('h-4 w-1/2', skeletonTokens.line)} />
        <div className={clsx('h-4 w-16', skeletonTokens.line)} />
      </div>
      <div className={clsx('h-3 w-full', skeletonTokens.line)} />
      <div className={clsx('h-3 w-5/6', skeletonTokens.line)} />
    </div>
  );
}
