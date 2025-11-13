import Link from 'next/link';
import { Logo } from './Logo';
import { getDictionary } from '@/lib/i18n/server';

export async function Footer() {
  let dict: any;
  let lang: string;
  
  try {
    const result = await getDictionary();
    dict = result.dict;
    lang = result.lang;
  } catch (error) {
    dict = {};
    lang = 'en';
  }
  
  const description = lang === 'zh' 
    ? '中亚领先的科技平台，为专业人士提供智能工具，助力数字未来。'
    : lang === 'kk'
    ? 'Орталық Азиядағы жетекші технологиялық платформа, мамандарға цифрлық болашақ үшін ақылды құралдарды ұсынады.'
    : lang === 'ru'
    ? 'Ведущая технологическая платформа Центральной Азии, предоставляющая профессионалам умные инструменты для цифрового будущего.'
    : 'The premier tech platform for Central Asia, empowering professionals with smart tools for a digital future.';

  const sitemapTitle = lang === 'zh' ? '网站地图' : lang === 'kk' ? 'Сайт картасы' : lang === 'ru' ? 'Карта сайта' : 'Sitemap';
  const legalTitle = lang === 'zh' ? '法律信息' : lang === 'kk' ? 'Құқықтық ақпарат' : lang === 'ru' ? 'Правовая информация' : 'Legal';

  return (
    <footer className="mt-20 sm:mt-28 py-10 border-t border-solid border-black/10 dark:border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 items-start col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="text-primary">
              <Logo />
            </div>
            <h2 className="text-[#111618] dark:text-white text-xl font-bold">KazSoft</h2>
          </Link>
          <p className="text-[#5f7d8c] dark:text-gray-400 text-sm max-w-sm">
            {description}
          </p>
        </div>
        <div className="col-span-1">
          <h3 className="font-bold text-[#111618] dark:text-white mb-4">{sitemapTitle}</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/ai"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {dict.nav?.ai || 'AI Tools'}
              </Link>
            </li>
            <li>
              <Link
                href="/languages"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {dict.nav?.languages || 'Language Hub'}
              </Link>
            </li>
            <li>
              <Link
                href="#exchange-rates"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {dict.rates?.title || 'Exchange Rates'}
              </Link>
            </li>
            <li>
              <Link
                href="/tutorials"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {dict.nav?.tutorials || 'Blog'}
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h3 className="font-bold text-[#111618] dark:text-white mb-4">{legalTitle}</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/terms"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {lang === 'zh' ? '服务条款' : lang === 'kk' ? 'Қызмет көрсету шарттары' : lang === 'ru' ? 'Условия использования' : 'Terms of Service'}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {lang === 'zh' ? '隐私政策' : lang === 'kk' ? 'Құпиялылық саясаты' : lang === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm text-[#5f7d8c] dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {lang === 'zh' ? '联系我们' : lang === 'kk' ? 'Бізбен байланысыңыз' : lang === 'ru' ? 'Связаться с нами' : 'Contact Us'}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-solid border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center text-sm text-[#5f7d8c] dark:text-gray-500">
        <p>© 2024 KazSoft. {lang === 'zh' ? '保留所有权利。' : lang === 'kk' ? 'Барлық құқықтар қорғалған.' : lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:text-primary transition-colors">
            LinkedIn
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Telegram
          </Link>
        </div>
      </div>
    </footer>
  );
}

