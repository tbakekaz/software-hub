import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AIPage() {
  // 直接进入发现风格界面
  redirect('/ai/discover');
}

