'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Rate {
  pair: string;
  value: string;
  change: string;
  changeColor: string;
  rateValue: number; // 添加实际汇率值用于计算
}

interface Props {
  rates: Rate[];
  dict?: any;
  lang: string;
}

type Currency = 'KZT' | 'USD' | 'EUR' | 'CNY' | 'RUB';

export function ExchangeRatesClient({ rates, dict, lang }: Props) {
  const [showCalculator, setShowCalculator] = useState(true);
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>('KZT');
  const [toCurrency, setToCurrency] = useState<Currency>('USD');

  // 创建汇率映射 - rates 中的值是 1 单位外币 = X KZT
  const rateMap = useMemo(() => {
    const map: Record<string, number> = { KZT: 1 };
    rates.forEach((rate) => {
      const currency = rate.pair.split('/')[0] as Currency;
      map[currency] = parseFloat(rate.value) || 1;
    });
    return map;
  }, [rates]);

  // 汇率计算
  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return null;
    }

    if (fromCurrency === toCurrency) {
      return numAmount;
    }

    // 如果源货币是 KZT，转换为目标货币
    // rateMap[USD] = 445.50 表示 1 USD = 445.50 KZT
    // 所以 100 KZT = 100 / 445.50 USD
    if (fromCurrency === 'KZT') {
      const rate = rateMap[toCurrency];
      if (!rate || rate <= 0) return null;
      return numAmount / rate;
    }

    // 如果目标货币是 KZT，从源货币转换
    // 100 USD = 100 * 445.50 KZT
    if (toCurrency === 'KZT') {
      const rate = rateMap[fromCurrency];
      if (!rate || rate <= 0) return null;
      return numAmount * rate;
    }

    // 两个都不是 KZT，先转换为 KZT，再转换为目标货币
    // 例如：100 USD 转 EUR
    // 100 USD = 100 * 445.50 = 44550 KZT
    // 44550 KZT = 44550 / 482.10 = 92.37 EUR
    const fromRate = rateMap[fromCurrency];
    const toRate = rateMap[toCurrency];
    if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) return null;
    
    const kztAmount = numAmount * fromRate;
    return kztAmount / toRate;
  }, [amount, fromCurrency, toCurrency, rateMap]);

  const getCurrencyName = (currency: Currency): string => {
    return dict?.currencyNames?.[currency] || currency;
  };

  const formatCurrency = (value: number | null): string => {
    if (value === null) return '0.00';
    const locale = lang === 'zh' ? 'zh-CN' : lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US';
    if (value >= 1) {
      return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return value.toLocaleString(locale, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const calculatorText = dict?.calculator || (lang === 'zh' ? '汇率计算' : lang === 'kk' ? 'Бағам есептегіші' : lang === 'ru' ? 'Калькулятор курса' : 'Exchange Calculator');
  const hideCalculatorText = dict?.hideCalculator || (lang === 'zh' ? '隐藏计算器' : lang === 'kk' ? 'Есептегішті жасыру' : lang === 'ru' ? 'Скрыть калькулятор' : 'Hide Calculator');
  const convertText = dict?.convert || (lang === 'zh' ? '汇率换算' : lang === 'kk' ? 'Валюта айырбастау' : lang === 'ru' ? 'Конвертация валют' : 'Currency Conversion');
  const amountText = dict?.amount || (lang === 'zh' ? '金额' : lang === 'kk' ? 'Сома' : lang === 'ru' ? 'Сумма' : 'Amount');
  const fromText = dict?.from || (lang === 'zh' ? '从' : lang === 'kk' ? 'Басқа' : lang === 'ru' ? 'Из' : 'From');
  const toText = dict?.to || (lang === 'zh' ? '到' : lang === 'kk' ? 'Айырбастау' : lang === 'ru' ? 'В' : 'To');
  const swapText = dict?.swap || (lang === 'zh' ? '交换' : lang === 'kk' ? 'Ауыстыру' : lang === 'ru' ? 'Поменять' : 'Swap');
  const resultText = dict?.result || (lang === 'zh' ? '换算结果' : lang === 'kk' ? 'Нәтиже' : lang === 'ru' ? 'Результат' : 'Result');

  return (
    <div className="space-y-4">
      {/* 汇率卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {rates.map((rate) => (
          <div
            key={rate.pair}
            className="flex flex-col gap-1.5 rounded-xl p-4 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <p className="text-[#111618] dark:text-gray-300 text-sm font-medium leading-normal">
              {rate.pair}
            </p>
            <p className="text-[#111618] dark:text-white tracking-light text-xl font-bold leading-tight">
              {rate.value}
            </p>
            <p className={`${rate.changeColor} text-sm font-medium leading-normal`}>
              {rate.change}
            </p>
          </div>
        ))}
      </div>

      {/* 汇率计算器 */}
      <div className="rounded-xl p-4 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#111618] dark:text-white">{convertText}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-xs h-8"
          >
            {showCalculator ? hideCalculatorText : calculatorText}
          </Button>
        </div>

        {showCalculator && (
          <div className="space-y-3">
            {/* 输入金额 */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#5f7d8c] dark:text-gray-400">{amountText}</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={amountText}
                min="0"
                step="0.01"
                className="w-full h-9 text-sm"
              />
            </div>

            {/* 货币选择 - 交换按钮在中间 */}
            <div className="relative flex items-end gap-3">
              <div className="space-y-1.5 flex-1 max-w-[140px]">
                <label className="text-xs text-[#5f7d8c] dark:text-gray-400">{fromText}</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as Currency)}
                  className="flex h-9 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-[#111618] dark:text-white"
                >
                  {(['KZT', 'USD', 'EUR', 'CNY', 'RUB'] as Currency[]).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} ({getCurrencyName(curr)})
                    </option>
                  ))}
                </select>
              </div>

              {/* 交换按钮 - 在中间 */}
              <div className="flex-shrink-0 pb-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapCurrencies}
                  className="text-xs h-7 w-7 p-0 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 shadow-sm"
                  type="button"
                  title={swapText}
                >
                  ⇅
                </Button>
              </div>

              <div className="space-y-1.5 flex-1 max-w-[140px]">
                <label className="text-xs text-[#5f7d8c] dark:text-gray-400">{toText}</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as Currency)}
                  className="flex h-9 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-[#111618] dark:text-white"
                >
                  {(['KZT', 'USD', 'EUR', 'CNY', 'RUB'] as Currency[]).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} ({getCurrencyName(curr)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 计算结果 */}
            {convertedAmount !== null && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-xs text-[#5f7d8c] dark:text-gray-400 mb-1">{resultText}</div>
                <div className="text-xl font-bold text-[#111618] dark:text-white">
                  {formatCurrency(convertedAmount)} {toCurrency}
                </div>
                <div className="text-xs text-[#5f7d8c] dark:text-gray-400 mt-1.5">
                  {formatCurrency(parseFloat(amount) || 0)} {fromCurrency} = {formatCurrency(convertedAmount)} {toCurrency}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

