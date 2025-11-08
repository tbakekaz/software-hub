import { getDictionary } from '@/lib/i18n/server';

export default async function Footer() {
  const { dict } = await getDictionary();
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
        <p>© {new Date().getFullYear()} Software Hub</p>
        <div className="flex gap-4">
          <a href="/privacy">{dict.footer.privacy}</a>
          <a href="/terms">{dict.footer.terms}</a>
          <a href="/sponsor">{dict.footer.sponsor}</a>
        </div>
      </div>
    </footer>
  );
}


