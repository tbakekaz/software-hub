import { Hero } from '@/components/Hero';
import { ExchangeRates } from '@/components/ExchangeRates';
import { ToolsSection } from '@/components/ToolsSection';
import { UpdatesSection } from '@/components/UpdatesSection';
import { getDictionary } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  try {
    const { dict } = await getDictionary();
    return {
      title: dict.home?.title || 'KazSoft - The Premier Tech Platform for Central Asia',
      description: dict.home?.subtitle || 'Smart tools for tech enthusiasts, students, entrepreneurs, and professionals. Your gateway to innovation starts here.',
      alternates: {
        languages: {
          'x-default': '/',
          'zh-KZ': '/zh',
          'kk-KZ': '/kk',
          'ru-RU': '/ru',
          'en': '/en',
        },
      },
    };
  } catch (error) {
    return {
      title: 'KazSoft - The Premier Tech Platform for Central Asia',
      description: 'Smart tools for tech enthusiasts, students, entrepreneurs, and professionals. Your gateway to innovation starts here.',
    };
  }
}

export default async function HomePage() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-primary/30 via-background-light to-background-light dark:from-primary/20 dark:via-background-dark dark:to-background-dark -z-10" />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-16 sm:py-24">
          {/* Hero 和汇率并排布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-20 sm:mb-28">
            <div className="order-2 lg:order-1">
              <Hero />
            </div>
            <div className="order-1 lg:order-2">
              <ExchangeRates />
            </div>
          </div>
          <ToolsSection />
          <UpdatesSection />
        </main>
      </div>
    </div>
  );
}

