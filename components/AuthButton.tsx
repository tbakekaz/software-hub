"use client";
import { useEffect, useState, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocal(getUser()); }, []);

  // 点击外部区域关闭
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // ESC 键关闭
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

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
      <div className="relative" ref={dropdownRef}>
        <button className="px-3 h-8 rounded-full border text-sm" onClick={() => setOpen((v) => !v)}>
          {user.name} · {(labels?.pro || 'PRO')}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded border bg-background shadow z-50">
            <div className="p-3 text-sm relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-lg leading-none w-5 h-5 flex items-center justify-center"
                aria-label="关闭"
              >
                ×
              </button>
              <div className="mb-2 pr-6">{user.email || 'guest'}</div>
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
    <div className="relative" ref={dropdownRef}>
      <button className="px-3 h-8 rounded-full border text-sm" onClick={() => { setTab('login'); setOpen(true); }}>{labels?.login || 'Login'}/{labels?.register || 'Register'}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded border bg-background shadow p-3 text-sm z-50">
          <div className="relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-0 right-0 text-muted-foreground hover:text-foreground text-lg leading-none w-5 h-5 flex items-center justify-center"
              aria-label="关闭"
            >
              ×
            </button>
            <div className="flex gap-2 mb-2 pr-6">
              <button className={`px-2 py-1 rounded ${tab==='login'?'border':''}`} onClick={() => setTab('login')}>{labels?.login || 'Login'}</button>
              <button className={`px-2 py-1 rounded ${tab==='register'?'border':''}`} onClick={() => setTab('register')}>{labels?.register || 'Register'}</button>
            </div>
          </div>
          <div className="space-y-2">
            <input className="w-full h-8 px-2 rounded border" placeholder={labels?.nickname || 'Nickname'} value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="w-full h-8 px-2 rounded border" placeholder={labels?.email || 'Email'} value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div className="flex gap-2">
              {tab==='login' ? (
                <button className="flex-1 h-8 rounded border" onClick={login}>{labels?.signin || 'Sign in'}</button>
              ) : (
                <button className="flex-1 h-8 rounded border" onClick={register}>{labels?.signup || 'Sign up'}</button>
              )}
              <button
                className="h-8 px-3 rounded border text-xs"
                onClick={() => setOpen(false)}
                type="button"
              >
                取消
              </button>
            </div>
            <a className="block text-center text-xs text-muted-foreground" href="/pricing">{labels?.pro || 'Pro Member'}</a>
          </div>
        </div>
      )}
    </div>
  );
}


