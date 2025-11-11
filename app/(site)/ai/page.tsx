import { redirect } from 'next/navigation';

export const revalidate = 3600;

export default function AIPage() {
  // 直接进入发现风格界面
  redirect('/ai/discover');
}
