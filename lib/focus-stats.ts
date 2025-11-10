'use client';

export type FocusSession = {
  duration: number; // 计划时长（分钟）
  actualTime: number; // 实际时长（秒）
  completedAt: string;
  completed: boolean; // 是否完成
};

const STORAGE_KEY = 'focus_sessions';

export function getFocusSessions(): FocusSession[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveFocusSession(session: FocusSession) {
  if (typeof window === 'undefined') return;
  
  const sessions = getFocusSessions();
  sessions.push(session);
  
  // 只保留最近 100 条记录
  if (sessions.length > 100) {
    sessions.splice(0, sessions.length - 100);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  
  // 同时更新学习统计（专注时间也算学习时间）
  const { getLearningStats, saveLearningStats } = require('./learning-progress');
  const stats = getLearningStats();
  stats.totalTimeSpent += Math.floor(session.actualTime / 60);
  stats.experience += Math.floor(session.actualTime / 60); // 每分钟 = 1 经验值
  saveLearningStats(stats);
}

export function getFocusStats() {
  const sessions = getFocusSessions();
  const completedSessions = sessions.filter(s => s.completed);
  
  const totalSessions = completedSessions.length;
  const totalMinutes = completedSessions.reduce((sum, s) => sum + Math.floor(s.actualTime / 60), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const avgDuration = totalSessions > 0 
    ? Math.floor(totalMinutes / totalSessions) 
    : 0;
  
  // 今日统计
  const today = new Date().toDateString();
  const todaySessions = completedSessions.filter(s => 
    new Date(s.completedAt).toDateString() === today
  );
  const todayMinutes = todaySessions.reduce((sum, s) => sum + Math.floor(s.actualTime / 60), 0);
  
  // 本周统计
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekSessions = completedSessions.filter(s => 
    new Date(s.completedAt) >= weekAgo
  );
  const weekMinutes = weekSessions.reduce((sum, s) => sum + Math.floor(s.actualTime / 60), 0);
  
  return {
    totalSessions,
    totalMinutes,
    totalHours,
    avgDuration,
    todaySessions: todaySessions.length,
    todayMinutes,
    weekSessions: weekSessions.length,
    weekMinutes
  };
}

