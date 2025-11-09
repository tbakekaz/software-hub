// 临时简化 layout，移除所有可能有问题的组件
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import { MonetizeSlot } from '@/components/MonetizeSlot';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 临时移除所有组件，测试是否是它们导致的问题 */}
      {/* <Navbar />
      <div className="sticky top-0 z-30">
        <MonetizeSlot position="global-header" className="border-b" />
      </div> */}
      <div className="flex-1">{children}</div>
      {/* <Footer /> */}
    </div>
  );
}




