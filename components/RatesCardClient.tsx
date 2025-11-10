'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { RatesResponse } from '@/lib/rates';

interface Props {
  initialData: RatesResponse;
}

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 分钟自动刷新

type Currency = 'KZT' | 'USD' | 'EUR' | 'CNY' | 'RUB';

const CURRENCY_NAMES: Record<Currency, string> = {
  KZT: '坚戈',
  USD: '美元',
  EUR: '欧元',
  CNY: '人民币',
  RUB: '卢布',
};

export function RatesCardClient({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showCalculator, setShowCalculator] = useState(true); // 默认显示计算器
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>('KZT');
  const [toCurrency, setToCurrency] = useState<Currency>('USD');

  // 获取最新汇率数据
  const fetchLatestRates = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/rates', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const newData = await res.json();
        console.log('[RatesCard] Fetched new data:', newData);
        // 验证数据有效性
        if (newData.rates && 
            newData.rates.USD > 0 && 
            newData.rates.EUR > 0 && 
            newData.rates.CNY > 0 && 
            newData.rates.RUB > 0) {
          setData(newData);
          setLastUpdate(new Date());
        } else {
          console.warn('[RatesCard] Fetched data still invalid:', newData);
        }
      } else {
        console.warn('[RatesCard] API response not OK:', res.status);
      }
    } catch (error) {
      console.warn('[RatesCard] Auto-refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 调试：检查初始数据并确保有效
  useEffect(() => {
    console.log('[RatesCard] Initial data received:', {
      date: initialData.date,
      source: initialData.source,
      rates: initialData.rates,
    });
    
    // 如果初始数据为 0 或无效，立即尝试获取新数据
    if (!initialData.rates || 
        initialData.rates.USD === 0 || 
        initialData.rates.EUR === 0 || 
        initialData.rates.CNY === 0 || 
        initialData.rates.RUB === 0) {
      console.warn('[RatesCard] Initial data has zero values, fetching immediately');
      fetchLatestRates();
    } else {
      // 即使数据有效，也更新本地状态以确保显示最新数据
      setData(initialData);
    }
  }, [initialData, fetchLatestRates]);

  // 自动刷新汇率数据
  useEffect(() => {
    // 立即执行一次（如果初始数据超过 5 分钟或数据无效）
    const initialAge = Date.now() - new Date(initialData.date).getTime();
    const hasInvalidData = !initialData.rates || 
      initialData.rates.USD === 0 || 
      initialData.rates.EUR === 0 || 
      initialData.rates.CNY === 0 || 
      initialData.rates.RUB === 0;
    
    // 如果数据无效或超过 5 分钟，立即获取新数据
    if (hasInvalidData || initialAge > AUTO_REFRESH_INTERVAL) {
      fetchLatestRates();
    }

    // 设置定时器，每 5 分钟自动刷新
    const interval = setInterval(fetchLatestRates, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [initialData.date, initialData.rates?.USD, initialData.rates?.EUR, fetchLatestRates]);

  const formatRate = (rate: number | undefined | null): string => {
    // 确保 rate 是有效数字
    if (typeof rate !== 'number' || isNaN(rate)) {
      console.warn('[RatesCard] Invalid rate value:', rate, typeof rate);
      return '0.000000';
    }
    // 即使 rate 是 0，也要格式化显示
    if (rate === 0) {
      return '0.000000';
    }
    if (rate >= 1) {
      return rate.toFixed(2);
    } else if (rate >= 0.01) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(6);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 汇率计算逻辑
  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return null;
    }

    // 如果源货币和目标货币相同，直接返回
    if (fromCurrency === toCurrency) {
      return numAmount;
    }

    // 如果源货币是 KZT，转换为目标货币
    if (fromCurrency === 'KZT') {
      const rate = data.rates[toCurrency as 'USD' | 'EUR' | 'CNY' | 'RUB'];
      if (!rate || rate <= 0) return null;
      return numAmount * rate;
    }

    // 如果目标货币是 KZT，从源货币转换
    if (toCurrency === 'KZT') {
      const rate = data.rates[fromCurrency as 'USD' | 'EUR' | 'CNY' | 'RUB'];
      if (!rate || rate <= 0) return null;
      return numAmount / rate;
    }

    // 两个都不是 KZT，先转换为 KZT，再转换为目标货币
    const fromRate = data.rates[fromCurrency as 'USD' | 'EUR' | 'CNY' | 'RUB'];
    const toRate = data.rates[toCurrency as 'USD' | 'EUR' | 'CNY' | 'RUB'];
    if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) return null;
    
    // 先转换为 KZT，再转换为目标货币
    const kztAmount = numAmount / fromRate;
    return kztAmount * toRate;
  }, [amount, fromCurrency, toCurrency, data.rates]);

  const formatCurrency = (value: number | null): string => {
    if (value === null) return '0.00';
    if (value >= 1) {
      return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return value.toLocaleString('zh-CN', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="font-medium">
          KZT 汇率
          {data.date && <span className="text-xs text-muted-foreground ml-2">({data.date})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-xs"
          >
            {showCalculator ? '隐藏计算器' : '汇率计算'}
          </Button>
          {isLoading && (
            <span className="text-xs text-muted-foreground animate-pulse">更新中...</span>
          )}
          {!isLoading && lastUpdate && (
            <span className="text-xs text-muted-foreground">
              已更新: {formatTime(lastUpdate)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">美元 (USD)</div>
            <div className="font-semibold text-lg">
              {formatRate(data.rates?.USD)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">欧元 (EUR)</div>
            <div className="font-semibold text-lg">
              {formatRate(data.rates?.EUR)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">人民币 (CNY)</div>
            <div className="font-semibold text-lg">
              {formatRate(data.rates?.CNY)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">卢布 (RUB)</div>
            <div className="font-semibold text-lg">
              {formatRate(data.rates?.RUB)}
            </div>
          </div>
        </div>
        {data.source && data.source !== 'default' && (
          <div className="mt-3 text-xs text-muted-foreground text-center">
            数据来源: {data.source}
          </div>
        )}

        {/* 汇率计算器 */}
        {showCalculator && (
          <div className="mt-6 pt-6 border-t space-y-4">
            <div className="text-sm font-medium mb-3">汇率换算</div>
            
            <div className="space-y-3">
              {/* 输入金额 */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">金额</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入金额"
                  min="0"
                  step="0.01"
                  className="w-full"
                />
              </div>

              {/* 货币选择 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">从</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as Currency)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {(['KZT', 'USD', 'EUR', 'CNY', 'RUB'] as Currency[]).map((curr) => (
                      <option key={curr} value={curr}>
                        {curr} ({CURRENCY_NAMES[curr]})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">到</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as Currency)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {(['KZT', 'USD', 'EUR', 'CNY', 'RUB'] as Currency[]).map((curr) => (
                      <option key={curr} value={curr}>
                        {curr} ({CURRENCY_NAMES[curr]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 交换按钮 */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapCurrencies}
                  className="text-xs"
                  type="button"
                >
                  ⇅ 交换
                </Button>
              </div>

              {/* 计算结果 */}
              {convertedAmount !== null && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="text-xs text-muted-foreground mb-1">换算结果</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(convertedAmount)} {toCurrency}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {formatCurrency(parseFloat(amount) || 0)} {fromCurrency} = {formatCurrency(convertedAmount)} {toCurrency}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

