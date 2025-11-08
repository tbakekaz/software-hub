"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pickLocaleString } from '@/lib/i18n/translate';
import { SoftwareDownloadModal } from '@/components/SoftwareDownloadModal';
import type { Lang } from '@/lib/i18n';
import type { Software } from '@/lib/content';

type Props = {
  item: Software;
  lang: Lang;
  dict: {
    software: {
      downloadFrom: string;
      source123pan: string;
      sourceR2: string;
      sourceOther: string;
      version: string;
      latest: string;
      download: string;
    };
  };
};

export function RelatedSoftwareCard({ item, lang, dict }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const name = pickLocaleString(item.name_i18n || item.name, lang);
  const desc = pickLocaleString(item.description_i18n || item.description, lang);

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-border/50">
        <CardHeader className="flex items-center justify-between pb-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-medium hover:underline text-base text-left"
          >
            {name}
          </button>
          <Badge className="text-[10px] bg-muted/50 text-muted-foreground border-0 px-1.5 py-0.5">
            v{item.version}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
      
      {isModalOpen && (
        <SoftwareDownloadModal
          software={item}
          lang={lang}
          dict={dict}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

