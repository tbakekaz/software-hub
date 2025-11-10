"use client";
import { useEffect, useState } from 'react';
import { getUser, setUser, isPro } from '@/lib/auth';

export type PricingLabels = {
  title: string; desc: string; free: string; pro: string; perks: { free: string[]; pro: string[] }; cta: string; upgraded: string; note: string; nickname: string; pay?: { title: string; kaspi: string; card: string; crypto: string };
};

export default function PricingClient({ labels }: { labels: PricingLabels }) {
  const [pro, setPro] = useState(false);
  const [userName, setUserName] = useState('');
  useEffect(() => { setPro(isPro()); setUserName(getUser()?.name || ''); }, []);

  function upgrade() {
    const u = getUser() || { name: userName || 'User', plan: 'free' as const };
    u.plan = 'pro'; setUser(u); setPro(true);
  }

  return (
    <main className="container mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">{labels.title}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{labels.desc}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-medium mb-4">{labels.free}</h2>
          <ul className="space-y-2 text-sm">
            {labels.perks.free.map((p)=> (
              <li key={p} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 relative">
          {pro && (
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded">已激活</span>
            </div>
          )}
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            {labels.pro}
            {pro && <span className="text-emerald-600">✓</span>}
          </h2>
          <ul className="space-y-2 text-sm mb-6">
            {labels.perks.pro.map((p)=> (
              <li key={p} className="flex items-start gap-2">
                <span className="text-emerald-600">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {pro ? (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded text-emerald-600 text-sm text-center">
              {labels.upgraded}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <input 
                className="w-full h-10 px-3 rounded border bg-background" 
                placeholder={labels.nickname} 
                value={userName} 
                onChange={(e)=>setUserName(e.target.value)} 
              />
              <button 
                className="w-full h-10 rounded bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition-opacity" 
                onClick={upgrade}
              >
                {labels.cta}
              </button>
              <div className="text-xs text-muted-foreground text-center">{labels.note}</div>
            </div>
          )}
        </div>
      </div>

      {labels.pay && (
        <section className="space-y-3">
          <h2 className="text-xl font-medium">{labels.pay.title}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded p-4 text-sm">
              <div className="font-medium mb-1">{labels.pay.kaspi}</div>
              <div className="text-muted-foreground">二维码/链接占位</div>
            </div>
            <div className="border rounded p-4 text-sm">
              <div className="font-medium mb-1">{labels.pay.card}</div>
              <div className="text-muted-foreground">**** **** **** 0000</div>
            </div>
            <div className="border rounded p-4 text-sm">
              <div className="font-medium mb-1">{labels.pay.crypto}</div>
              <div className="text-muted-foreground">USDT(ERC20): 0x...</div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}


