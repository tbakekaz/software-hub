import { getAllSoftware } from '@/lib/content';
import ClientList from './ClientList';
import { getDictionary } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function SoftwarePage() {
  const { dict } = await getDictionary();
  const list = getAllSoftware();
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">{dict.software.listTitle}</h1>
      {/* 客户端搜索与展示 */}
      <ClientList items={list} dict={dict} />
    </main>
  );
}

