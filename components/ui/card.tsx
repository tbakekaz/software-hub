import * as React from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-lg border bg-background text-foreground shadow-sm hover:shadow-md transition-shadow', className)} {...props} />;
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="p-4 border-b" {...props} />;
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="p-4" {...props} />;
}
export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="p-4 border-t" {...props} />;
}




