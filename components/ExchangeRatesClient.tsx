'use client';

interface Rate {
  pair: string;
  value: string;
  change: string;
  changeColor: string;
}

interface Props {
  rates: Rate[];
  dict?: any;
  lang: string;
}

export function ExchangeRatesClient({ rates, dict, lang }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {rates.map((rate) => (
        <div
          key={rate.pair}
          className="flex flex-col gap-2 rounded-xl p-6 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal">
            {rate.pair}
          </p>
          <p className="text-[#111618] dark:text-white tracking-light text-2xl font-bold leading-tight">
            {rate.value}
          </p>
          <p className={`${rate.changeColor} text-base font-medium leading-normal`}>
            {rate.change}
          </p>
        </div>
      ))}
    </div>
  );
}

