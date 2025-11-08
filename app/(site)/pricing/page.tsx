import { getDictionary } from '@/lib/i18n/server';
import PricingClient from './PricingClient';

export const runtime = 'edge';

export default async function PricingPage() {
  const { dict } = await getDictionary();
  return <PricingClient labels={dict.pricing} />;
}


