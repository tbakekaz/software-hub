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
  
  const tools = [
    {
      icon: 'translate',
      title: dict.section?.languageLearning || 'Language Learning Tools',
      description: dict.section?.languageLearningDesc || 'Master regional and global languages with our interactive vocabulary builders and translation services.',
      href: '/languages',
    },
    {
      icon: 'spark',
      title: dict.section?.aiAssistants || 'AI-Powered Assistants',
      description: dict.section?.aiAssistantsDesc || 'Leverage artificial intelligence for content generation, creative ideas, and workflow automation.',
      href: '/ai',
    },
    {
      icon: 'code_blocks',
      title: dict.section?.codeAnalysis || 'Code & Data Analysis',
      description: dict.section?.codeAnalysisDesc || 'Utilize powerful tools for quick data analysis, code assistance, and project development.',
      href: '/software',
    },
  ];

  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-[#111618] dark:text-white tracking-tight text-[32px] font-bold leading-tight sm:text-4xl sm:font-black max-w-2xl">
          {dict.section?.exploreTools || 'Explore Our Smart Tools'}
        </h1>
        <p className="text-[#5f7d8c] dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
          {dict.section?.exploreToolsDesc || 'Discover our suite of tools designed to enhance your productivity and knowledge in the digital age.'}
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
              {dict.section?.learnMore || 'Learn More'} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

