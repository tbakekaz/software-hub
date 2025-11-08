"use client";

import { useState, useEffect } from 'react';
import { TutorialModal } from '@/components/TutorialModal';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { TutorialMeta } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

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

  const handleClick = () => {
    setIsModalOpen(true);
  };

  // 当模态框打开时，加载教程内容
  useEffect(() => {
    if (isModalOpen && !tutorialContent) {
      fetch(`/api/tutorials/${tutorial.slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.content) {
            setTutorialContent(data.content);
          }
        })
        .catch(err => {
          console.error('Failed to load tutorial content:', err);
        });
    }
  }, [isModalOpen, tutorial.slug, tutorialContent]);

  return (
    <>
      <div 
        className="border rounded p-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleClick}
      >
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">
          {typeof tutorial.date === 'string' 
            ? tutorial.date 
            : (tutorial.date as any)?.toISOString?.().slice(0,10) ?? ''}
        </div>
        {summary && <p className="text-sm mt-1">{summary}</p>}
      </div>
      
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

