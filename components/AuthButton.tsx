"use client";
import { useEffect, useState } from 'react';
import { getUser, setUser, type User } from '@/lib/auth';

export type AuthLabels = {
  login: string; register: string; nickname: string; email: string; signin: string; signup: string; logout: string; upgrade: string; member: string; pro: string; logged: string; favorites?: string;
};

export default function AuthButton({ labels }: { labels?: AuthLabels }) {
  const [user, setLocal] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'login'|'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => { setLocal(getUser()); }, []);

  function login() {
    const u: User = { name: name || 'User', email, plan: 'free' };
    setUser(u); setLocal(u); setOpen(false);
  }
  function register() { login(); }
  function signout() { setUser(null); setLocal(null); }
  function upgrade() {
    const u = getUser();
    if (!u) return setOpen(true);
    u.plan = 'pro'; setUser(u); setLocal(u);
  }

  if (user) {
    return (
      <div className="relative">
        <button className="px-3 h-8 rounded-full border text-sm" onClick={() => setOpen((v) => !v)}>
          {user.name} · {(labels?.pro || 'PRO')}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded border bg-background shadow">
            <div className="p-3 text-sm">
              <div className="mb-2">{user.email || 'guest'}</div>
              <button className="w-full h-8 rounded border mb-2" onClick={upgrade}>{labels?.upgrade || 'Upgrade'}</button>
              <a className="block w-full h-8 rounded border text-center leading-8" href="/pricing">{labels?.member || 'Pricing'}</a>
              <a className="block w-full h-8 rounded border text-center leading-8 mt-2" href="/account">会员中心</a>
              <a className="block w-full h-8 rounded border text-center leading-8 mt-2" href="/ai/favorites">{labels?.favorites || 'Favorites'}</a>
              <button className="w-full h-8 rounded border mt-2" onClick={signout}>{labels?.logout || 'Sign out'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button className="px-3 h-8 rounded-full border text-sm" onClick={() => { setTab('login'); setOpen(true); }}>{labels?.login || 'Login'}/{labels?.register || 'Register'}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded border bg-background shadow p-3 text-sm">
          <div className="flex gap-2 mb-2">
            <button className={`px-2 py-1 rounded ${tab==='login'?'border':''}`} onClick={() => setTab('login')}>{labels?.login || 'Login'}</button>
            <button className={`px-2 py-1 rounded ${tab==='register'?'border':''}`} onClick={() => setTab('register')}>{labels?.register || 'Register'}</button>
          </div>
          <div className="space-y-2">
            <input className="w-full h-8 px-2 rounded border" placeholder={labels?.nickname || 'Nickname'} value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="w-full h-8 px-2 rounded border" placeholder={labels?.email || 'Email'} value={email} onChange={(e)=>setEmail(e.target.value)} />
            {tab==='login' ? (
              <button className="w-full h-8 rounded border" onClick={login}>{labels?.signin || 'Sign in'}</button>
            ) : (
              <button className="w-full h-8 rounded border" onClick={register}>{labels?.signup || 'Sign up'}</button>
            )}
            <a className="block text-center text-xs text-muted-foreground" href="/pricing">{labels?.pro || 'Pro Member'}</a>
          </div>
        </div>
      )}
    </div>
  );
}


