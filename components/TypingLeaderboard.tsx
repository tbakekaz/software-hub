'use client';

import { useState, useEffect } from 'react';
import { CardBase, CardHeader, CardBody } from '@/components/CardBase';
import type { Lang } from '@/lib/i18n';
import { getTypingSessions } from '@/lib/typing-progress';

interface LeaderboardEntry {
  wpm: number;
  accuracy: number;
  language: string;
  date: string;
}

interface Props {
  lang: Lang;
  dict?: {
    leaderboard?: string;
    rank?: string;
    wpm?: string;
    accuracy?: string;
    date?: string;
    noRecords?: string;
    allTime?: string;
    today?: string;
    thisWeek?: string;
    thisMonth?: string;
  };
}

export function TypingLeaderboard({ lang, dict }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    const sessions = getTypingSessions();
    
    // 根据时间筛选
    const now = new Date();
    let filtered = sessions;
    
    if (timeFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = sessions.filter(s => new Date(s.completedAt) >= today);
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = sessions.filter(s => new Date(s.completedAt) >= weekAgo);
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = sessions.filter(s => new Date(s.completedAt) >= monthAgo);
    }
    
    // 按 WPM 排序，取前 10 名
    const sorted = filtered
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10)
      .map(s => ({
        wpm: s.wpm,
        accuracy: s.accuracy,
        language: s.language,
        date: s.completedAt,
      }));
    
    setEntries(sorted);
  }, [timeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLanguageLabel = (langCode: string) => {
    const labels: Record<string, string> = {
      kazakh: lang === 'zh' ? '哈萨克语' : lang === 'kk' ? 'Қазақша' : lang === 'ru' ? 'Казахский' : 'Kazakh',
      chinese: lang === 'zh' ? '中文' : lang === 'kk' ? 'Қытай' : lang === 'ru' ? 'Китайский' : 'Chinese',
      russian: lang === 'zh' ? '俄语' : lang === 'kk' ? 'Орыс' : lang === 'ru' ? 'Русский' : 'Russian',
      english: lang === 'zh' ? '英语' : lang === 'kk' ? 'Ағылшын' : lang === 'ru' ? 'Английский' : 'English',
    };
    return labels[langCode] || langCode;
  };

  return (
    <CardBase>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">🏆 {dict?.leaderboard || '速度排行榜'}</h2>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-1 text-sm border rounded"
          >
            <option value="all">{dict?.allTime || '全部时间'}</option>
            <option value="today">{dict?.today || '今天'}</option>
            <option value="week">{dict?.thisWeek || '本周'}</option>
            <option value="month">{dict?.thisMonth || '本月'}</option>
          </select>
        </div>
      </CardHeader>
      <CardBody>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {dict?.noRecords || '暂无记录'}
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{entry.wpm} {dict?.wpm || 'WPM'}</span>
                    <span className="text-sm text-muted-foreground">
                      {entry.accuracy}% {dict?.accuracy || '准确率'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {getLanguageLabel(entry.language)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(entry.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </CardBase>
  );
}

