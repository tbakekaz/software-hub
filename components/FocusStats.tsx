'use client';

import { useEffect, useState } from 'react';
import { getFocusStats } from '@/lib/focus-stats';
import { CardBase, CardHeader, CardBody } from '@/components/CardBase';

export function FocusStats() {
  const [stats, setStats] = useState(getFocusStats());

  useEffect(() => {
    // 定期更新统计
    const interval = setInterval(() => {
      setStats(getFocusStats());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, []);

  return (
    <CardBase>
      <CardHeader>
        <h3 className="text-lg font-semibold">📊 专注统计</h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">总次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalHours}</div>
            <div className="text-sm text-muted-foreground">总时长（小时）</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.todaySessions}</div>
            <div className="text-sm text-muted-foreground">今日次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.todayMinutes}</div>
            <div className="text-sm text-muted-foreground">今日时长（分钟）</div>
          </div>
        </div>
        
        {stats.avgDuration > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <div className="text-sm text-muted-foreground">平均专注时长</div>
            <div className="text-xl font-bold">{stats.avgDuration} 分钟</div>
          </div>
        )}
      </CardBody>
    </CardBase>
  );
}

