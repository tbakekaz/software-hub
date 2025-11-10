import { clsx } from 'clsx';

export function SkeletonGrid({
  count = 6,
  columns = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  className,
}: {
  count?: number;
  columns?: string;
  className?: string;
}) {
  return (
    <div className={clsx(columns, className)} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border/60 bg-muted/20 dark:bg-muted/10 p-5 space-y-3 animate-pulse"
        >
          <div className="h-4 w-1/2 rounded-full bg-muted/60 dark:bg-muted/30" />
          <div className="h-3 w-full rounded-full bg-muted/50 dark:bg-muted/30" />
          <div className="h-3 w-5/6 rounded-full bg-muted/50 dark:bg-muted/30" />
        </div>
      ))}
    </div>
  );
}
