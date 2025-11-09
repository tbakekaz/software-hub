import { getDictionary } from '@/lib/i18n/server';
import PricingClient from './PricingClient';

export const runtime = 'edge';

export default async function PricingPage() {
  try {
    const { dict } = await getDictionary();
    return <PricingClient labels={dict.pricing} />;
  } catch (error: any) {
    console.error('[PricingPage] Error:', error);
    const fallback = await getDictionary();
    return <PricingClient labels={fallback.dict.pricing} />;
  }
}


