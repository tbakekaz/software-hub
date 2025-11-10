export const cardTokens = {
  container:
    'relative rounded-2xl border border-border/60 bg-background/80 dark:bg-background/40 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 backdrop-blur-sm',
  compactContainer:
    'relative rounded-xl border border-border/50 bg-background/70 dark:bg-background/30 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 backdrop-blur-sm',
  padding: 'p-4 sm:p-5',
  header: 'flex items-start justify-between gap-3',
  body: 'space-y-2 text-sm text-muted-foreground',
  badge:
    'inline-flex items-center rounded-full bg-muted/80 text-muted-foreground text-[10px] font-medium px-2 py-0.5 border border-border/50',
  meta: 'text-xs text-muted-foreground/80 flex items-center gap-2 flex-wrap',
  ctaLink:
    'inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full px-2 py-1 bg-primary/5 dark:bg-primary/10',
};

export const skeletonTokens = {
  base: 'animate-pulse',
  line: 'h-3 rounded-full bg-muted/60 dark:bg-muted/30',
};
