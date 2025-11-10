import { CardBase, CardHeader, CardBody, CardBadge } from '@/components/CardBase';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { Lang } from '@/lib/i18n';

export function SoftwareCard({ item, lang }: { item: { slug: string; name: string; name_i18n?: any; description: string; description_i18n?: any; version: string }; lang: Lang }) {
  const name = pickLocaleString(item.name_i18n || item.name, lang);
  const desc = pickLocaleString(item.description_i18n || item.description, lang);
  return (
    <CardBase href={`/software/${item.slug}`} className="group">
      <CardHeader>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </div>
        </div>
        <CardBadge>v{item.version}</CardBadge>
      </CardHeader>
      <CardBody>
        <p className="line-clamp-2 leading-relaxed">{desc}</p>
      </CardBody>
    </CardBase>
  );
}


