import { SkeletonGrid } from '@/components/SkeletonGrid';

export default function LoadingTutorials() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="h-8 w-40 rounded-full bg-muted/40 dark:bg-muted/20 animate-pulse" />
      <SkeletonGrid count={6} columns="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
    </main>
  );
}
