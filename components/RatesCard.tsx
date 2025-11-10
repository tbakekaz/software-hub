import { fetchKZTRates } from '@/lib/rates';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RatesCardClient } from './RatesCardClient';

export default async function RatesCard() {
  try {
    const data = await fetchKZTRates();
    console.log('[RatesCard Server] Fetched data:', {
      source: data.source,
      date: data.date,
      rates: data.rates,
      ratesType: typeof data.rates,
      usdType: typeof data.rates?.USD,
      usdValue: data.rates?.USD,
    });
    
    // 验证数据有效性 - 确保所有值都是有效数字且大于 0
    const isValid = data.rates && 
      typeof data.rates.USD === 'number' && !isNaN(data.rates.USD) && data.rates.USD > 0 &&
      typeof data.rates.EUR === 'number' && !isNaN(data.rates.EUR) && data.rates.EUR > 0 &&
      typeof data.rates.CNY === 'number' && !isNaN(data.rates.CNY) && data.rates.CNY > 0 &&
      typeof data.rates.RUB === 'number' && !isNaN(data.rates.RUB) && data.rates.RUB > 0;
    
    if (!isValid) {
      console.warn('[RatesCard Server] Invalid data, using fallback. Data:', JSON.stringify(data, null, 2));
      // 使用默认值
      const fallback = {
        base: 'KZT' as const,
        date: new Date().toISOString().slice(0, 10),
        rates: { 
          USD: 0.00191, 
          EUR: 0.00165, 
          CNY: 0.0136, 
          RUB: 0.154 
        },
        source: 'fallback' as const
      };
      return <RatesCardClient initialData={fallback} />;
    }
    
    // 确保数据可以被正确序列化
    const serializedData = {
      base: data.base,
      date: data.date,
      rates: {
        USD: Number(data.rates.USD),
        EUR: Number(data.rates.EUR),
        CNY: Number(data.rates.CNY),
        RUB: Number(data.rates.RUB),
      },
      source: data.source || 'unknown'
    };
    
    console.log('[RatesCard Server] Serialized data:', serializedData);
    return <RatesCardClient initialData={serializedData} />;
  } catch (error: any) {
    console.error('[RatesCard Server] Error:', error);
    // 使用默认值
    const fallback = {
      base: 'KZT' as const,
      date: new Date().toISOString().slice(0, 10),
      rates: { 
        USD: 0.00191, 
        EUR: 0.00165, 
        CNY: 0.0136, 
        RUB: 0.154 
      },
      source: 'fallback' as const
    };
    return <RatesCardClient initialData={fallback} />;
  }
}




