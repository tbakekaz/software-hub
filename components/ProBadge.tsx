"use client";
import { isPro } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';

export function ProBadge({ className }: { className?: string }) {
  if (!isPro()) return null;
  return (
    <Badge className={`bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white border-0 ${className}`}>
      PRO
    </Badge>
  );
}



