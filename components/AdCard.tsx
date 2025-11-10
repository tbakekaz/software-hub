import { CardBase, CardHeader, CardBody, CardCTA, CardBadge } from '@/components/CardBase';

interface AdCardProps {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  badge?: string;
  icon?: string;
  onClick?: () => void;
}

export function AdCard({
  title,
  description,
  href,
  ctaLabel = '了解详情',
  badge = 'Sponsored',
  icon = '🔥',
  onClick,
}: AdCardProps) {
  return (
    <CardBase
      href={href}
      target="_blank"
      rel="noopener"
      className="group"
      onClick={onClick}
      aria-label={`推广：${title}`}
    >
      <CardHeader className="items-start gap-3">
        <div className="text-3xl" aria-hidden>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CardBadge>{badge}</CardBadge>
            <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </span>
          </div>
          <CardCTA className="bg-transparent px-0 text-xs uppercase tracking-wide text-primary/70">
            {ctaLabel} →
          </CardCTA>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{description}</p>
      </CardBody>
    </CardBase>
  );
}
