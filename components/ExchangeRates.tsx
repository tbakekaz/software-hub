import { fetchKZTRates } from '@/lib/rates';
import { getDictionary } from '@/lib/i18n/server';
import { ExchangeRatesClient } from './ExchangeRatesClient';

export async function ExchangeRates() {
  let dict: any;
  let lang: string;
  
  try {
    const result = await getDictionary();
    dict = result.dict;
    lang = result.lang;
  } catch (error) {
    dict = {};
    lang = 'en';
  }
  
  try {
    const data = await fetchKZTRates();
    
    // 将 KZT 汇率转换为 1 单位外币 = X KZT 的格式
    const usdRate = data.rates.USD > 0 ? (1 / data.rates.USD) : 0;
    const eurRate = data.rates.EUR > 0 ? (1 / data.rates.EUR) : 0;
    const rubRate = data.rates.RUB > 0 ? (1 / data.rates.RUB) : 0;
    const cnyRate = data.rates.CNY > 0 ? (1 / data.rates.CNY) : 0;
    
    const rates = [
      {
        pair: 'USD/KZT',
        value: usdRate > 0 ? usdRate.toFixed(2) : '0.00',
        change: '+0.25%',
        changeColor: 'text-[#078836]',
        rateValue: usdRate,
      },
      {
        pair: 'EUR/KZT',
        value: eurRate > 0 ? eurRate.toFixed(2) : '0.00',
        change: '-0.10%',
        changeColor: 'text-[#e73508]',
        rateValue: eurRate,
      },
      {
        pair: 'RUB/KZT',
        value: rubRate > 0 ? rubRate.toFixed(2) : '0.00',
        change: '+0.50%',
        changeColor: 'text-[#078836]',
        rateValue: rubRate,
      },
      {
        pair: 'CNY/KZT',
        value: cnyRate > 0 ? cnyRate.toFixed(2) : '0.00',
        change: '+0.15%',
        changeColor: 'text-[#078836]',
        rateValue: cnyRate,
      },
    ];

    const titleText = dict.rates?.title || (lang === 'zh' ? '实时汇率' : lang === 'kk' ? 'Қазақстан теңге бағамы' : lang === 'ru' ? 'Курс тенге' : 'Live Exchange Rates');
    
    return (
      <section id="exchange-rates" className="mt-20 sm:mt-28">
        <h2 className="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-4">
          {titleText}
        </h2>
        <ExchangeRatesClient rates={rates} dict={dict.rates} lang={lang} />
      </section>
    );
  } catch (error) {
    // 如果获取失败，使用默认值
    const rates = [
      {
        pair: 'USD/KZT',
        value: '445.50',
        change: '+0.25%',
        changeColor: 'text-[#078836]',
        rateValue: 445.50,
      },
      {
        pair: 'EUR/KZT',
        value: '482.10',
        change: '-0.10%',
        changeColor: 'text-[#e73508]',
        rateValue: 482.10,
      },
      {
        pair: 'RUB/KZT',
        value: '4.85',
        change: '+0.50%',
        changeColor: 'text-[#078836]',
        rateValue: 4.85,
      },
      {
        pair: 'CNY/KZT',
        value: '61.50',
        change: '+0.15%',
        changeColor: 'text-[#078836]',
        rateValue: 61.50,
      },
    ];
    
    const titleText = dict.rates?.title || (lang === 'zh' ? '实时汇率' : lang === 'kk' ? 'Қазақстан теңге бағамы' : lang === 'ru' ? 'Курс тенге' : 'Live Exchange Rates');
    
    return (
      <section id="exchange-rates" className="mt-20 sm:mt-28">
        <h2 className="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-4">
          {titleText}
        </h2>
        <ExchangeRatesClient rates={rates} dict={dict.rates} lang={lang} />
      </section>
    );
  }
}

