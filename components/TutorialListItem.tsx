import Link from 'next/link';

export function TutorialListItem({ item }: { item: { slug: string; title: string; date: string; summary?: string } }) {
  return (
    <div className="border rounded p-4">
      <Link href={`/tutorials/${item.slug}`} className="font-medium underline">{item.title}</Link>
      <div className="text-xs text-muted-foreground">{item.date}</div>
      {item.summary ? <p className="text-sm">{item.summary}</p> : null}
    </div>
  );
}




