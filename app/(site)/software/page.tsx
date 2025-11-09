import { getAllSoftware } from '@/lib/content-edge';
import ClientList from './ClientList';
import { getDictionary } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function SoftwarePage() {
  try {
    const { dict } = await getDictionary();
    const list = getAllSoftware();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{dict.software.listTitle}</h1>
        {/* 客户端搜索与展示 */}
        <ClientList items={list} dict={dict} />
      </main>
    );
  } catch (error: any) {
    console.error('[SoftwarePage] Error:', error);
    const fallback = await getDictionary();
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{fallback.dict.software.listTitle}</h1>
        <p className="text-muted-foreground">暂无软件</p>
      </main>
    );
  }
}

