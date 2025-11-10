import Link from 'next/link';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { EnglishResource } from '@/lib/content-edge';
import type { Lang } from '@/lib/i18n';

export function EnglishResourceCard({ resource, lang }: { resource: EnglishResource; lang: Lang }) {
  const title = pickLocaleString(resource.title_i18n || resource.title, lang);
  const description = pickLocaleString(resource.description_i18n || resource.description, lang);
  
  const resourceCount = resource.resources.length;
  const hasVideo = resource.resources.some(r => r.type === 'video');
  const hasAudio = resource.resources.some(r => r.type === 'audio');
  const hasDocument = resource.resources.some(r => r.type === 'document' || r.type === 'pdf');

  return (
    <Link
      href={`/english/${resource.slug}`}
      className="block border rounded-lg p-5 hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary capitalize">
            {resource.level}
          </span>
          <span className="px-2 py-1 text-xs rounded border capitalize">
            {resource.category}
          </span>
        </div>
        {resource.isFree && (
          <span className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-600">
            免费
          </span>
        )}
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
      
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {hasVideo && <span>🎥 视频</span>}
        {hasAudio && <span>🎵 音频</span>}
        {hasDocument && <span>📄 文档</span>}
        <span>{resourceCount} 个资源</span>
      </div>
    </Link>
  );
}

