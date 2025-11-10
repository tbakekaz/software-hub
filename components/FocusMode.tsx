'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { Lang } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export type FocusDuration = 5 | 15 | 30; // 分钟

interface FocusModeProps {
  onComplete?: (duration: FocusDuration, actualTime: number) => void;
  onClose?: () => void;
  lang?: Lang;
}

export function FocusMode({ onComplete, onClose, lang = 'zh' }: FocusModeProps) {
  const dict = t(lang).focusMode || {};
  const [duration, setDuration] = useState<FocusDuration>(15);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // 秒
  const [startTime, setStartTime] = useState<number | null>(null);
  const [actualTimeSpent, setActualTimeSpent] = useState(0); // 实际学习时长（秒）
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度百分比
  const progress = duration > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  // 开始专注
  const handleStart = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    const now = Date.now();
    setStartTime(now);
    startTimeRef.current = now;
    setTimeLeft(duration * 60);
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 时间到
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          const actualSeconds = Math.floor((Date.now() - (startTimeRef.current || now)) / 1000);
          setActualTimeSpent(actualSeconds);
          setIsActive(false);
          
          // 播放完成音效（可选）
          playCompletionSound();
          
          // 触发完成回调
          setTimeout(() => {
            onComplete?.(duration, actualSeconds);
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, onComplete]);

  // 暂停/继续
  const handlePause = useCallback(() => {
    if (isPaused) {
      // 继续
      setIsPaused(false);
      const elapsed = duration * 60 - timeLeft;
      startTimeRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            const actualSeconds = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
            setActualTimeSpent(actualSeconds);
            setIsActive(false);
            playCompletionSound();
            setTimeout(() => {
              onComplete?.(duration, actualSeconds);
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // 暂停
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // 计算实际学习时长
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setActualTimeSpent(elapsed);
      }
    }
  }, [isPaused, timeLeft, duration, onComplete]);

  // 停止/重置
  const handleStop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setStartTime(null);
    setActualTimeSpent(0);
    startTimeRef.current = null;
  }, [duration]);

  // 播放完成音效
  const playCompletionSound = () => {
    try {
      // 使用 Web Audio API 生成简单的提示音
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // 忽略错误
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 页面可见性检测（标签页切换时暂停）
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive && !isPaused) {
        handlePause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isPaused, handlePause]);

  // 当duration改变时更新timeLeft
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  // 如果最小化且正在运行，显示紧凑模式
  if (isMinimized && isActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-background/95 backdrop-blur-lg rounded-lg p-4 shadow-2xl border-2 border-primary/30 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">🎯 {dict.focusing || '专注中'}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
                title={dict.expand || '展开'}
                aria-label={dict.expand || '展开'}
              >
                ⬆️
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded transition-colors"
                title={dict.close || '关闭'}
                aria-label={dict.close || '关闭'}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{formatTime(timeLeft)}</div>
            <div className="text-xs text-muted-foreground mb-2">
              {isPaused ? (dict.paused || '已暂停') : (dict.focusingStatus || '专注中...')}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-2">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePause}
                className="flex-1 px-3 py-1.5 text-xs rounded border hover:bg-muted transition-colors"
              >
                {isPaused ? `▶️ ${dict.resume || '继续'}` : `⏸️ ${dict.pause || '暂停'}`}
              </button>
              <button
                onClick={handleStop}
                className="flex-1 px-3 py-1.5 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
              >
                ⏹️ {dict.stop || '停止'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 完整模式（未开始或展开状态）
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      {/* 半透明背景（未开始时显示） */}
      {!isActive && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        />
      )}
      
      {/* 专注模式窗口 */}
      <div 
        className="bg-background/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-primary/30 w-full max-w-sm pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭和最小化按钮 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🎯 {dict.title || '专注学习'}</h2>
          <div className="flex gap-2">
            {isActive && (
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title={dict.minimize || '最小化'}
                aria-label={dict.minimize || '最小化'}
              >
                ➖
              </button>
            )}
            {!isActive && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title={dict.close || '关闭'}
                aria-label={dict.close || '关闭'}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 时间选择（未开始时） */}
        {!isActive && (
          <>
            <p className="text-sm text-muted-foreground mb-3 text-center">{dict.subtitle || '选择专注时长，开始高效学习'}</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {([5, 15, 30] as FocusDuration[]).map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setDuration(mins);
                    setTimeLeft(mins * 60);
                  }}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition-all text-sm
                    ${duration === mins
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                    }
                  `}
                >
                  <div className="text-xl font-bold">{mins}</div>
                  <div className="text-xs text-muted-foreground">{dict.minutes || '分钟'}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 倒计时显示 */}
        <div className="text-center mb-4">
          <div className="relative inline-block">
            {/* 较小的圆形进度条 */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            
            {/* 时间文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-3xl font-bold mb-1">{formatTime(timeLeft)}</div>
                {isActive && (
                  <div className="text-xs text-muted-foreground">
                    {isPaused ? (dict.paused || '已暂停') : (dict.focusingStatus || '专注中...')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-2">
          {!isActive ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              ▶️ {dict.start || '开始专注'}
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="flex-1"
              >
                {isPaused ? `▶️ ${dict.resume || '继续'}` : `⏸️ ${dict.pause || '暂停'}`}
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              >
                ⏹️ {dict.stop || '停止'}
              </Button>
            </>
          )}
        </div>

        {/* 提示信息 */}
        {isActive && !isPaused && (
          <div className="mt-4 text-center text-xs text-muted-foreground">
            💡 {dict.tip || '可最小化到角落继续学习'}
          </div>
        )}

        {/* 统计信息（暂停时显示） */}
        {isPaused && actualTimeSpent > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
            <div className="text-xs text-muted-foreground mb-1">{dict.timeSpent || '已专注时长'}</div>
            <div className="text-xl font-bold">{formatTime(actualTimeSpent)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

