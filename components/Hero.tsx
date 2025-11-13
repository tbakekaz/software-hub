import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/server';

export async function Hero() {
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
  
  const title = dict.home?.title || 'The Premier Tech Platform for Central Asia';
  const subtitle = dict.home?.subtitle || 'Smart tools for tech enthusiasts, students, entrepreneurs, and professionals. Your gateway to innovation starts here.';
  const ctaText = lang === 'zh' ? '立即开始' : lang === 'kk' ? 'Қазір бастау' : lang === 'ru' ? 'Начать сейчас' : 'Start Now';

  return (
    <section className="text-center">
      <div className="flex flex-col gap-4 sm:gap-5 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-[#111618] dark:text-white text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tighter max-w-3xl">
          {title}
        </h1>
        <h2 className="text-[#5f7d8c] dark:text-gray-400 text-base sm:text-lg font-normal leading-normal max-w-2xl">
          {subtitle}
        </h2>
        <Link
          href="/languages"
          className="flex min-w-[84px] max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="truncate">{ctaText}</span>
        </Link>
      </div>
    </section>
  );
}

