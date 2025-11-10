export interface TypingSession {
  language: 'kazakh' | 'chinese' | 'russian' | 'english';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wpm: number;
  accuracy: number;
  time: number; // 秒
  errors: number;
  lessonId: string;
  completedAt: string;
}

export interface TypingStats {
  language: 'kazakh' | 'chinese' | 'russian' | 'english';
  totalSessions: number;
  totalTime: number; // 秒
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  lessonsCompleted: number;
  completedLessons: string[];
}

const STORAGE_KEY = 'typing_progress';

export function saveTypingProgress(session: TypingSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const sessions: TypingSession[] = existing ? JSON.parse(existing) : [];
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save typing progress:', error);
  }
}

export function getTypingSessions(language?: TypingSession['language']): TypingSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const sessions: TypingSession[] = existing ? JSON.parse(existing) : [];
    return language ? sessions.filter(s => s.language === language) : sessions;
  } catch (error) {
    console.error('Failed to get typing sessions:', error);
    return [];
  }
}

export function getTypingStats(language: TypingSession['language']): TypingStats {
  const sessions = getTypingSessions(language);
  
  if (sessions.length === 0) {
    return {
      language,
      totalSessions: 0,
      totalTime: 0,
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
      lessonsCompleted: 0,
      completedLessons: [],
    };
  }
  
  const totalTime = sessions.reduce((sum, s) => sum + s.time, 0);
  const totalWpm = sessions.reduce((sum, s) => sum + s.wpm, 0);
  const totalAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0);
  const bestWpm = Math.max(...sessions.map(s => s.wpm));
  const completedLessons = [...new Set(sessions.map(s => s.lessonId))];
  
  return {
    language,
    totalSessions: sessions.length,
    totalTime,
    averageWpm: Math.round(totalWpm / sessions.length),
    bestWpm,
    averageAccuracy: Math.round(totalAccuracy / sessions.length),
    lessonsCompleted: completedLessons.length,
    completedLessons,
  };
}

export function getAllTypingStats(): TypingStats[] {
  const languages: TypingSession['language'][] = ['kazakh', 'chinese', 'russian', 'english'];
  return languages.map(lang => getTypingStats(lang));
}

