"use client";

import { useState } from 'react';
import { CardBase, CardHeader, CardBody, CardBadge } from '@/components/CardBase';
import { pickLocaleString } from '@/lib/i18n/translate';
import { SoftwareDownloadModal } from '@/components/SoftwareDownloadModal';
import type { Lang } from '@/lib/i18n';
import type { Software } from '@/lib/content-edge';

const openModalKeys = ['Enter', ' '];

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

  const handleOpen = () => setIsModalOpen(true);

  return (
    <>
      <CardBase
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (openModalKeys.includes(event.key)) {
            event.preventDefault();
            handleOpen();
          }
        }}
        className="h-full cursor-pointer select-none group"
        compact
      >
        <CardHeader>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-base text-left line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </div>
          </div>
          <CardBadge>v{item.version}</CardBadge>
        </CardHeader>
        <CardBody className="flex-1">
          <p className="line-clamp-3 leading-relaxed">{desc}</p>
        </CardBody>
      </CardBase>

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

