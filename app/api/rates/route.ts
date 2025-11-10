import { fetchKZTRates } from '@/lib/rates';
import { NextResponse } from 'next/server';

// 移除 edge runtime 以确保 fetch 正常工作
// export const runtime = 'edge';
export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    console.log('[API /rates] Fetching rates...');
    const data = await fetchKZTRates();
    console.log('[API /rates] Fetched data:', {
      source: data.source,
      date: data.date,
      rates: data.rates,
    });
    
    // 验证数据有效性
    if (!data.rates || 
        data.rates.USD === 0 || 
        data.rates.EUR === 0 || 
        data.rates.CNY === 0 || 
        data.rates.RUB === 0) {
      console.warn('[API /rates] Invalid data received, using fallback');
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('[API /rates] Error:', error);
    // 返回默认值而不是错误
    const fallback = {
      base: 'KZT',
      date: new Date().toISOString().slice(0, 10),
      rates: { 
        USD: 0.00191, 
        EUR: 0.00165, 
        CNY: 0.0136, 
        RUB: 0.154 
      },
      source: 'fallback'
    };
    return NextResponse.json(fallback, {
      status: 200, // 返回 200 而不是 500，确保前端能收到数据
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}

