import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/server';

export async function ToolsSection() {
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
  
  const learnMore = lang === 'zh' ? '了解更多' : lang === 'kk' ? 'Көбірек білу' : lang === 'ru' ? 'Узнать больше' : 'Learn More';
  
  const tools = [
    {
      icon: 'translate',
      title: lang === 'zh' ? '语言学习工具' : lang === 'kk' ? 'Тіл үйрену құралдары' : lang === 'ru' ? 'Инструменты для изучения языков' : 'Language Learning Tools',
      description: lang === 'zh' 
        ? '通过我们的交互式词汇构建器和翻译服务，掌握区域和全球语言。'
        : lang === 'kk'
        ? 'Біздің интерактивті сөздік құрастырушылары мен аударма қызметтері арқылы аймақтық және жаһандық тілдерді меңгеріңіз.'
        : lang === 'ru'
        ? 'Освойте региональные и глобальные языки с помощью наших интерактивных конструкторов словарного запаса и услуг перевода.'
        : 'Master regional and global languages with our interactive vocabulary builders and translation services.',
      href: '/languages',
    },
    {
      icon: 'spark',
      title: lang === 'zh' ? 'AI 智能助手' : lang === 'kk' ? 'AI күшті көмекшілер' : lang === 'ru' ? 'AI-ассистенты' : 'AI-Powered Assistants',
      description: lang === 'zh'
        ? '利用人工智能进行内容生成、创意想法和工作流自动化。'
        : lang === 'kk'
        ? 'Контент генерациялау, шығармашылық идеялар және жұмыс ағынын автоматтандыру үшін жасанды интеллектті пайдаланыңыз.'
        : lang === 'ru'
        ? 'Используйте искусственный интеллект для генерации контента, творческих идей и автоматизации рабочих процессов.'
        : 'Leverage artificial intelligence for content generation, creative ideas, and workflow automation.',
      href: '/ai',
    },
    {
      icon: 'code_blocks',
      title: lang === 'zh' ? '代码与数据分析' : lang === 'kk' ? 'Код және деректерді талдау' : lang === 'ru' ? 'Анализ кода и данных' : 'Code & Data Analysis',
      description: lang === 'zh'
        ? '使用强大的工具进行快速数据分析、代码辅助和项目开发。'
        : lang === 'kk'
        ? 'Жылдам деректерді талдау, код көмегі және жобаны дамыту үшін күшті құралдарды пайдаланыңыз.'
        : lang === 'ru'
        ? 'Используйте мощные инструменты для быстрого анализа данных, помощи в коде и разработки проектов.'
        : 'Utilize powerful tools for quick data analysis, code assistance, and project development.',
      href: '/software',
    },
  ];

  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-[#111618] dark:text-white tracking-tight text-[32px] font-bold leading-tight sm:text-4xl sm:font-black max-w-2xl">
          {lang === 'zh' ? '探索我们的智能工具' : lang === 'kk' ? 'Біздің ақылды құралдарды зерттеңіз' : lang === 'ru' ? 'Изучите наши умные инструменты' : 'Explore Our Smart Tools'}
        </h1>
        <p className="text-[#5f7d8c] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
          {lang === 'zh' ? '发现我们旨在提升您在数字时代的生产力和知识的工具套件。' : lang === 'kk' ? 'Сіздің өнімділігіңізді және біліміңізді арттыруға арналған құралдар жиынтығын табыңыз.' : lang === 'ru' ? 'Откройте для себя наш набор инструментов, разработанных для повышения вашей продуктивности и знаний в цифровую эпоху.' : 'Discover our suite of tools designed to enhance your productivity and knowledge in the digital age.'}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <div
            key={tool.title}
            className="flex flex-col gap-4 rounded-xl p-6 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-center items-center hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              <span className="material-symbols-outlined text-2xl">{tool.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#111618] dark:text-white text-lg font-bold leading-tight">
                {tool.title}
              </h2>
              <p className="text-[#5f7d8c] dark:text-gray-400 text-sm font-normal leading-normal">
                {tool.description}
              </p>
            </div>
            <Link
              href={tool.href}
              className="mt-2 text-primary font-bold text-sm hover:underline hover:text-primary/80 transition-colors"
            >
              {learnMore} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

