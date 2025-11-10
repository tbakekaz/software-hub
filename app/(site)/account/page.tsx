import { getDictionary } from '@/lib/i18n/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';
// 移除 edge runtime 以避免 React forwardRef 相关问题
// export const runtime = 'edge';

export const metadata: Metadata = {
  title: `会员中心 - ${siteConfig.name}`,
  description: '管理您的会员账户和订阅',
  robots: {
    index: false,
  },
};

export default async function AccountPage() {
  const { dict } = await getDictionary();
  return <AccountClient dict={dict} />;
}



