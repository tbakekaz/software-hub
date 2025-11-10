import { getDictionary } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Footer() {
  const { dict, lang } = await getDictionary();
  const siteName = lang === 'zh' ? '软件中心' : lang === 'kk' ? 'Бағдарлама орталығы' : lang === 'ru' ? 'Центр программ' : 'Software Hub';
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground flex items-center justify-between">
        <p>© {new Date().getFullYear()} {siteName}</p>
        <div className="flex gap-4">
          <a href="/privacy">{dict.footer.privacy}</a>
          <a href="/terms">{dict.footer.terms}</a>
          <a href="/sponsor">{dict.footer.sponsor}</a>
        </div>
      </div>
    </footer>
  );
}


