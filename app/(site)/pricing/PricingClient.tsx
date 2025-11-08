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
      <h1 className="text-3xl font-semibold">{labels.title}</h1>
      <p className="text-muted-foreground">{labels.desc}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-6">
          <h2 className="text-xl font-medium mb-2">{labels.free}</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {labels.perks.free.map((p)=> (<li key={p}>{p}</li>))}
          </ul>
        </div>
        <div className="border rounded p-6">
          <h2 className="text-xl font-medium mb-2">{labels.pro}</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {labels.perks.pro.map((p)=> (<li key={p}>{p}</li>))}
          </ul>
          {pro ? (
            <div className="mt-4 text-emerald-600">{labels.upgraded}</div>
          ) : (
            <div className="mt-4 space-y-2">
              <input className="w-full h-9 px-2 rounded border" placeholder={labels.nickname} value={userName} onChange={(e)=>setUserName(e.target.value)} />
              <button className="w-full h-9 rounded border" onClick={upgrade}>{labels.cta}</button>
              <div className="text-xs text-muted-foreground">{labels.note}</div>
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


