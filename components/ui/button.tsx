import * as React from 'react';
import { clsx } from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      default: 'bg-foreground text-background hover:opacity-90',
      outline: 'border border-border hover:bg-accent',
      ghost: 'hover:bg-accent'
    } as const;
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5'
    } as const;
    return (
      <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = 'Button';




