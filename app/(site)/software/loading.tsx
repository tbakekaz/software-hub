import { SkeletonGrid } from '@/components/SkeletonGrid';

export default function LoadingSoftwareList() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="h-8 w-48 rounded-full bg-muted/40 dark:bg-muted/20 animate-pulse" />
      <SkeletonGrid count={8} />
    </main>
  );
}
