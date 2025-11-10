export type RatesResponse = {
  base: 'KZT';
  date: string;
  rates: { USD: number; EUR: number; CNY: number; RUB: number };
  source?: string;
};

// 使用真实的汇率数据作为默认值（2025年11月的近似值）
const DEFAULT_SEED: RatesResponse = {
  base: 'KZT',
  date: new Date().toISOString().slice(0, 10),
  rates: { 
    USD: 0.00191,  // 1 KZT ≈ 0.00191 USD
    EUR: 0.00165,  // 1 KZT ≈ 0.00165 EUR
    CNY: 0.0136,   // 1 KZT ≈ 0.0136 CNY
    RUB: 0.154     // 1 KZT ≈ 0.154 RUB
  },
  source: 'default'
};

// cache in memory during ISR window
declare global {
  // eslint-disable-next-line no-var
  var __lastRates: RatesResponse | undefined;
  // eslint-disable-next-line no-var
  var __lastRatesTime: number | undefined;
}

const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * 从 exchangerate-api.com 获取汇率（免费，无需 API key）
 */
async function fetchFromExchangeRateAPI(): Promise<RatesResponse | null> {
  try {
    const url = 'https://api.exchangerate-api.com/v4/latest/KZT';
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      console.warn('[rates] exchangerate-api.com failed:', res.status, res.statusText);
      return null;
    }
    const json = await res.json();
    
    // 验证数据有效性（注意：小数值如 0.00191 是 truthy，所以检查 > 0）
    const usd = Number(json.rates?.USD);
    const eur = Number(json.rates?.EUR);
    const cny = Number(json.rates?.CNY);
    const rub = Number(json.rates?.RUB);
    
    // 检查是否为有效数字且大于 0
    if (isNaN(usd) || isNaN(eur) || isNaN(cny) || isNaN(rub) || usd <= 0 || eur <= 0 || cny <= 0 || rub <= 0) {
      console.warn('[rates] Invalid data from exchangerate-api.com:', { usd, eur, cny, rub, raw: json.rates });
      return null;
    }
    
    return {
      base: 'KZT',
      date: json.date || new Date().toISOString().slice(0, 10),
      rates: {
        USD: usd,
        EUR: eur,
        CNY: cny,
        RUB: rub,
      },
      source: 'exchangerate-api.com'
    };
  } catch (error: any) {
    console.warn('[rates] exchangerate-api.com error:', error?.message);
    return null;
  }
}

/**
 * 从 exchangerate.host 获取汇率（备用方案）
 */
async function fetchFromExchangeRateHost(): Promise<RatesResponse | null> {
  try {
    const url = 'https://api.exchangerate.host/latest?base=KZT&symbols=USD,EUR,CNY,RUB';
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      console.warn('[rates] exchangerate.host failed:', res.status, res.statusText);
      return null;
    }
    const json = await res.json();
    
    // 验证数据有效性（注意：小数值如 0.00191 是 truthy，所以检查 > 0）
    const usd = Number(json.rates?.USD);
    const eur = Number(json.rates?.EUR);
    const cny = Number(json.rates?.CNY);
    const rub = Number(json.rates?.RUB);
    
    // 检查是否为有效数字且大于 0
    if (isNaN(usd) || isNaN(eur) || isNaN(cny) || isNaN(rub) || usd <= 0 || eur <= 0 || cny <= 0 || rub <= 0) {
      console.warn('[rates] Invalid data from exchangerate.host:', { usd, eur, cny, rub, raw: json.rates });
      return null;
    }
    
    return {
      base: 'KZT',
      date: json.date || new Date().toISOString().slice(0, 10),
      rates: {
        USD: usd,
        EUR: eur,
        CNY: cny,
        RUB: rub,
      },
      source: 'exchangerate.host'
    };
  } catch (error: any) {
    console.warn('[rates] exchangerate.host error:', error?.message);
    return null;
  }
}

/**
 * 获取哈萨克斯坦坚戈（KZT）汇率
 * 使用多个数据源，确保可靠性
 */
export async function fetchKZTRates(): Promise<RatesResponse> {
  // 检查缓存
  const now = Date.now();
  if (globalThis.__lastRates && globalThis.__lastRatesTime && (now - globalThis.__lastRatesTime) < CACHE_DURATION) {
    // 验证缓存数据有效性
    if (globalThis.__lastRates.rates.USD > 0) {
      return globalThis.__lastRates;
    }
  }

  // 尝试多个数据源
  let data: RatesResponse | null = null;

  // 方案1: exchangerate-api.com（推荐，免费且稳定）
  try {
    data = await fetchFromExchangeRateAPI();
    if (data && data.rates.USD > 0 && data.rates.EUR > 0 && data.rates.CNY > 0 && data.rates.RUB > 0) {
      globalThis.__lastRates = data;
      globalThis.__lastRatesTime = now;
      console.log('[rates] Successfully fetched from exchangerate-api.com');
      return data;
    }
  } catch (error: any) {
    console.warn('[rates] exchangerate-api.com failed:', error?.message);
  }

  // 方案2: exchangerate.host（备用）
  try {
    data = await fetchFromExchangeRateHost();
    if (data && data.rates.USD > 0 && data.rates.EUR > 0 && data.rates.CNY > 0 && data.rates.RUB > 0) {
      globalThis.__lastRates = data;
      globalThis.__lastRatesTime = now;
      console.log('[rates] Successfully fetched from exchangerate.host');
      return data;
    }
  } catch (error: any) {
    console.warn('[rates] exchangerate.host failed:', error?.message);
  }

  // 方案3: 使用环境变量指定的 API
  // 在 Edge Runtime 中，使用全局变量而不是 process.env
  const customApiUrl = typeof process !== 'undefined' && process.env ? process.env.EXCHANGE_API_URL : undefined;
  if (customApiUrl) {
    try {
      const url = `${customApiUrl}?base=KZT&symbols=USD,EUR,CNY,RUB`;
      const res = await fetch(url, { 
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        const usd = Number(json.rates?.USD);
        const eur = Number(json.rates?.EUR);
        const cny = Number(json.rates?.CNY);
        const rub = Number(json.rates?.RUB);
        
        if (!isNaN(usd) && !isNaN(eur) && !isNaN(cny) && !isNaN(rub) && 
            usd > 0 && eur > 0 && cny > 0 && rub > 0) {
          data = {
            base: 'KZT',
            date: json.date || new Date().toISOString().slice(0, 10),
            rates: { USD: usd, EUR: eur, CNY: cny, RUB: rub },
            source: 'custom'
          };
          globalThis.__lastRates = data;
          globalThis.__lastRatesTime = now;
          console.log('[rates] Successfully fetched from custom API');
          return data;
        }
      }
    } catch (error: any) {
      console.warn('[rates] Custom API failed:', error?.message);
    }
  }

  // 如果所有方案都失败，使用缓存或默认值
  const fallback = globalThis.__lastRates || DEFAULT_SEED;
  console.warn('[rates] Using fallback data:', { source: fallback.source, rates: fallback.rates });
  return fallback;
}




