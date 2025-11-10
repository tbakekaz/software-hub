import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MonetizeSlot } from '@/components/MonetizeSlot';

// 禁用缓存，确保语言切换时布局能正确更新
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* 全局顶部粘性广告位 */}
      <div className="sticky top-0 z-30">
        <MonetizeSlot position="global-header" className="border-b" />
      </div>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}




