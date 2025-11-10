"use client";

export type User = {
  name: string;
  email?: string;
  plan: 'free' | 'pro';
  password?: string; // 密码（可选，用于修改密码功能）
};

const KEY = 'auth_user';

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export function setUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) localStorage.setItem(KEY, JSON.stringify(user));
  else localStorage.removeItem(KEY);
}

export function isPro(): boolean {
  const u = getUser();
  return u?.plan === 'pro';
}




