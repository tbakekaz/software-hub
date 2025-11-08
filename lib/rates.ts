export type RatesResponse = {
  base: 'KZT';
  date: string;
  rates: { USD: number; EUR: number; CNY: number; RUB: number };
};

const DEFAULT_SEED: RatesResponse = {
  base: 'KZT',
  date: '2025-01-01',
  rates: { USD: 0.0022, EUR: 0.0020, CNY: 0.016, RUB: 0.21 }
};

// cache in memory during ISR window
declare global {
  // eslint-disable-next-line no-var
  var __lastRates: RatesResponse | undefined;
}

export async function fetchKZTRates(): Promise<RatesResponse> {
  const apiUrl = process.env.EXCHANGE_API_URL || 'https://api.exchangerate.host/latest';
  const url = `${apiUrl}?base=KZT&symbols=USD,EUR,CNY,RUB`;
  try {
    const res = await fetch(url, { next: { revalidate: 14400 } });
    if (!res.ok) throw new Error('Failed to fetch rates');
    const json = await res.json();
    const data: RatesResponse = {
      base: 'KZT',
      date: json.date || new Date().toISOString().slice(0, 10),
      rates: {
        USD: Number(json.rates?.USD || 0),
        EUR: Number(json.rates?.EUR || 0),
        CNY: Number(json.rates?.CNY || 0),
        RUB: Number(json.rates?.RUB || 0)
      }
    };
    globalThis.__lastRates = data;
    return data;
  } catch {
    return globalThis.__lastRates || DEFAULT_SEED;
  }
}




