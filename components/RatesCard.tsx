import { fetchKZTRates } from '@/lib/rates';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default async function RatesCard() {
  const data = await fetchKZTRates();
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="font-medium">KZT 汇率（{data.date}）</div>
        {/* 手动刷新：客户端触发路由刷新更简单，这里提供占位 */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div>USD: {data.rates.USD}</div>
          <div>EUR: {data.rates.EUR}</div>
          <div>CNY: {data.rates.CNY}</div>
          <div>RUB: {data.rates.RUB}</div>
        </div>
      </CardContent>
    </Card>
  );
}




