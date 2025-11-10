'use client';

interface StarRatingProps {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StarRating({ stars, size = 'md', showLabel = false }: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };
  
  const labels = {
    0: '未完成',
    1: '已完成',
    2: '良好',
    3: '优秀'
  };
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((num) => (
        <span
          key={num}
          className={num <= stars ? 'text-yellow-500' : 'text-gray-300'}
        >
          ⭐
        </span>
      ))}
      {showLabel && (
        <span className="text-sm text-muted-foreground ml-2">
          {labels[stars as keyof typeof labels]}
        </span>
      )}
    </div>
  );
}

