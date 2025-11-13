import Link from 'next/link';
import { getAllTutorials } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import { pickLocaleString } from '@/lib/i18n/translate';
import type { Lang } from '@/lib/i18n';

export async function UpdatesSection() {
  let dict: any;
  let lang: Lang;
  
  try {
    const result = await getDictionary();
    dict = result.dict;
    lang = result.lang;
  } catch (error) {
    dict = {};
    lang = 'en';
  }
  
  const tutorials = getAllTutorials().slice(0, 3);
  
  const readMore = dict.section?.readMore || (lang === 'zh' ? '阅读更多' : lang === 'kk' ? 'Көбірек оқу' : lang === 'ru' ? 'Читать далее' : 'Read More');
  const sectionTitle = dict.section?.latestUpdates || (lang === 'zh' ? '最新更新与文章' : lang === 'kk' ? 'Соңғы жаңартулар мен мақалалар' : lang === 'ru' ? 'Последние обновления и статьи' : 'Latest Updates & Articles');
  const sectionDesc = dict.section?.latestUpdatesDesc || (lang === 'zh' 
    ? '了解 KazSoft 团队的最新新闻、产品更新和深度文章。'
    : lang === 'kk'
    ? 'KazSoft командасының соңғы жаңалықтары, өнім жаңартулары және терең мақалаларымен танысыңыз.'
    : lang === 'ru'
    ? 'Будьте в курсе последних новостей, обновлений продуктов и содержательных статей от команды KazSoft.'
    : 'Stay informed with the latest news, product updates, and insightful articles from the KazSoft team.');

  // 如果没有教程，使用占位内容
  if (tutorials.length === 0) {
    const placeholderUpdates = [
      {
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        alt: 'AI data visualization',
        category: lang === 'zh' ? '文章' : lang === 'kk' ? 'Мақала' : lang === 'ru' ? 'Статья' : 'ARTICLE',
        title: lang === 'zh' ? '使用 AI 解锁商业洞察' : lang === 'kk' ? 'AI арқылы бизнес түсініктерін ашу' : lang === 'ru' ? 'Раскрытие бизнес-инсайтов с помощью ИИ' : 'Unlocking Business Insights with AI',
        description: lang === 'zh' 
          ? '了解我们新的 AI 驱动数据分析工具如何将原始数据转化为可操作的智能。'
          : lang === 'kk'
          ? 'Біздің жаңа AI-қуатталған деректерді талдау құралдары шикі деректерді іс-әрекетке жарамды интеллектке қалай түрлендіретінін біліңіз.'
          : lang === 'ru'
          ? 'Узнайте, как наши новые инструменты анализа данных на основе ИИ могут преобразовать ваши необработанные данные в действенный интеллект.'
          : 'Discover how our new AI-powered data analysis tools can transform your raw data into actionable intelligence.',
        href: '/tutorials',
      },
      {
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        alt: 'Developer coding',
        category: lang === 'zh' ? '产品更新' : lang === 'kk' ? 'Өнім жаңартуы' : lang === 'ru' ? 'Обновление продукта' : 'PRODUCT UPDATE',
        title: lang === 'zh' ? '代码助手 v2.0 发布' : lang === 'kk' ? 'Код көмекшісі v2.0 енгізілді' : lang === 'ru' ? 'Представлен помощник по коду v2.0' : 'Introducing Code Assistant v2.0',
        description: lang === 'zh'
          ? '我们的代码助手现在更快、更智能，支持更多编程语言。看看有什么新功能。'
          : lang === 'kk'
          ? 'Біздің код көмекшімі енді жылдамырақ, ақылдырақ және көбірек бағдарламалау тілдерін қолдайды. Жаңалықтарды көріңіз.'
          : lang === 'ru'
          ? 'Наш помощник по коду теперь быстрее, умнее и поддерживает больше языков программирования. Посмотрите, что нового.'
          : 'Our code assistant is now faster, smarter, and supports more programming languages. See what\'s new.',
        href: '/tutorials',
      },
      {
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
        alt: 'Team collaboration',
        category: lang === 'zh' ? '公司新闻' : lang === 'kk' ? 'Компания жаңалықтары' : lang === 'ru' ? 'Новости компании' : 'COMPANY NEWS',
        title: lang === 'zh' ? 'KazSoft 扩展到新市场' : lang === 'kk' ? 'KazSoft жаңа нарықтарға кеңейді' : lang === 'ru' ? 'KazSoft расширяется на новые рынки' : 'KazSoft Expands to New Markets',
        description: lang === 'zh'
          ? '我们很高兴地宣布我们的扩张，将我们的智能工具带给中亚更多用户。'
          : lang === 'kk'
          ? 'Біз Орталық Азиядағы көбірек пайдаланушыларға біздің ақылды құралдарымызды әкелу арқылы кеңейтуімізді жариялағанымызға қуаныштымыз.'
          : lang === 'ru'
          ? 'Мы рады объявить о нашем расширении, принося наши умные инструменты большему количеству пользователей по всей Центральной Азии.'
          : 'We are excited to announce our expansion, bringing our smart tools to more users across Central Asia.',
        href: '/about',
      },
    ];

    return (
      <section className="mt-20 sm:mt-28">
        <div className="flex flex-col gap-4 text-center items-center">
          <h1 className="text-[#111618] dark:text-white tracking-tight text-[32px] font-bold leading-tight sm:text-4xl sm:font-black max-w-2xl">
            {sectionTitle}
          </h1>
          <p className="text-[#5f7d8c] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
            {sectionDesc}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholderUpdates.map((update, index) => (
            <Link
              key={index}
              href={update.href}
              className="flex flex-col rounded-xl overflow-hidden bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                className="w-full h-48 object-cover"
                alt={update.alt}
                src={update.image}
              />
              <div className="p-6 flex flex-col flex-1">
                <p className="text-primary text-sm font-bold">{update.category}</p>
                <h3 className="text-[#111618] dark:text-white font-bold text-lg mt-2">
                  {update.title}
                </h3>
                <p className="text-[#5f7d8c] dark:text-gray-400 text-sm mt-2 flex-grow">
                  {update.description}
                </p>
                <span className="mt-4 text-primary font-bold text-sm hover:underline">
                  {readMore} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-[#111618] dark:text-white tracking-tight text-[32px] font-bold leading-tight sm:text-4xl sm:font-black max-w-2xl">
          {sectionTitle}
        </h1>
        <p className="text-[#5f7d8c] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
          {sectionDesc}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tutorials.map((tutorial, index) => {
          const title = pickLocaleString(tutorial.title_i18n || tutorial.title, lang);
          const summary = pickLocaleString(tutorial.summary_i18n || tutorial.summary || '', lang) || 
            (lang === 'zh' ? '查看教程详情' : lang === 'kk' ? 'Оқулықты көру' : lang === 'ru' ? 'Просмотр учебника' : 'View tutorial details');
          
          return (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className="flex flex-col rounded-xl overflow-hidden bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-primary/50">article</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-primary text-sm font-bold">
                  {lang === 'zh' ? '教程' : lang === 'kk' ? 'Оқулық' : lang === 'ru' ? 'Учебник' : 'TUTORIAL'}
                </p>
                <h3 className="text-[#111618] dark:text-white font-bold text-lg mt-2">
                  {title}
                </h3>
                <p className="text-[#5f7d8c] dark:text-gray-400 text-sm mt-2 flex-grow">
                  {summary}
                </p>
                <span className="mt-4 text-primary font-bold text-sm hover:underline">
                  {readMore} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

