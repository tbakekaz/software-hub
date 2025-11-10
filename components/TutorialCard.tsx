"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { CardBase, CardHeader, CardBody, CardMeta } from '@/components/CardBase';
import { TutorialModal } from '@/components/TutorialModal';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { TutorialMeta } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

const formatDate = (value: TutorialMeta['date']) => {
  if (typeof value === 'string') return value;
  const iso = (value as any)?.toISOString?.();
  return iso ? iso.slice(0, 10) : '';
};

const ENTER_KEYS = ['Enter', ' '];

type Props = {
  tutorial: TutorialMeta;
  lang: Lang;
  dict: {
    software: {
      download: string;
      downloadFrom: string;
      source123pan: string;
      sourceR2: string;
      sourceOther: string;
      version: string;
      latest: string;
    };
  };
};

export function TutorialCard({ tutorial, lang, dict }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tutorialContent, setTutorialContent] = useState<string | null>(null);
  const title = pickLocaleString(tutorial.title_i18n || tutorial.title, lang);
  const summary = pickLocaleString(tutorial.summary_i18n || tutorial.summary, lang);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (ENTER_KEYS.includes(event.key)) {
      event.preventDefault();
      handleOpen();
    }
  };

  useEffect(() => {
    if (isModalOpen && !tutorialContent) {
      fetch(`/api/tutorials/${tutorial.slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.content) {
            setTutorialContent(data.content);
          }
        })
        .catch((err) => {
          console.error('Failed to load tutorial content:', err);
        });
    }
  }, [isModalOpen, tutorial.slug, tutorialContent]);

  return (
    <>
      <CardBase
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKey}
        className="cursor-pointer select-none group"
        compact
      >
        <CardHeader className="flex-col items-start gap-1">
          <div className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </div>
          <CardMeta>{formatDate(tutorial.date)}</CardMeta>
        </CardHeader>
        {summary && (
          <CardBody>
            <p className="line-clamp-3 leading-relaxed">{summary}</p>
          </CardBody>
        )}
      </CardBase>

      {isModalOpen && tutorialContent && (
        <TutorialModal
          tutorial={tutorial}
          content={tutorialContent}
          lang={lang}
          dict={dict}
          onClose={() => {
            setIsModalOpen(false);
            setTutorialContent(null);
          }}
        />
      )}
    </>
  );
}

