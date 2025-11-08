import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { Lang } from '@/lib/i18n';

export function SoftwareCard({ item, lang }: { item: { slug: string; name: string; name_i18n?: any; description: string; description_i18n?: any; version: string }; lang: Lang }) {
  const name = pickLocaleString(item.name_i18n || item.name, lang);
  const desc = pickLocaleString(item.description_i18n || item.description, lang);
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Link href={`/software/${item.slug}`} className="font-medium underline">
          {name}
        </Link>
        <span className="text-xs">v{item.version}</span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}


