import Link from 'next/link';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { LanguageResource } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

interface Props {
  resource: LanguageResource;
  lang: Lang;
  dict?: {
    category?: Record<string, string>;
    level?: Record<string, string>;
    targetLanguage?: Record<string, string>;
    resourceType?: Record<string, string>;
    free?: string;
    resources?: string;
  };
}

export function LanguageResourceCard({ resource, lang, dict }: Props) {
  const title = pickLocaleString(resource.title_i18n || resource.title, lang);
  const description = pickLocaleString(resource.description_i18n || resource.description, lang);
  
  const resourceCount = resource.resources.length;
  const hasVideo = resource.resources.some(r => r.type === 'video');
  const hasAudio = resource.resources.some(r => r.type === 'audio');
  const hasDocument = resource.resources.some(r => r.type === 'document' || r.type === 'pdf');

  const categoryLabel = dict?.category?.[resource.category] || resource.category;
  const levelLabel = dict?.level?.[resource.level] || resource.level;
  const targetLangLabel = dict?.targetLanguage?.[resource.targetLanguage] || resource.targetLanguage;

  return (
    <Link
      href={`/languages/${resource.slug}`}
      className="block border rounded-lg p-5 hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary capitalize">
            {levelLabel}
          </span>
          <span className="px-2 py-1 text-xs rounded border capitalize">
            {categoryLabel}
          </span>
          <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-600">
            {targetLangLabel}
          </span>
        </div>
        {resource.isFree && (
          <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-600">
            {dict?.free || '免费'}
          </span>
        )}
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
      
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {hasVideo && <span>🎥 {dict?.resourceType?.video || '视频'}</span>}
        {hasAudio && <span>🎵 {dict?.resourceType?.audio || '音频'}</span>}
        {hasDocument && <span>📄 {dict?.resourceType?.document || '文档'}</span>}
        <span>{resourceCount} {dict?.resources || '个资源'}</span>
      </div>
    </Link>
  );
}

