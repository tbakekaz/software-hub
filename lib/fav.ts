"use client";

const KEY = 'fav_ai_names';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function setFavorites(names: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(names));
}

export function toggleFavorite(name: string) {
  const list = getFavorites();
  const idx = list.indexOf(name);
  if (idx >= 0) list.splice(idx, 1); else list.push(name);
  setFavorites(list);
  return list;
}

export function isFavorite(name: string) {
  return getFavorites().includes(name);
}




