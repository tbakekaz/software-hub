'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export type FocusDuration = 5 | 15 | 30; // 分钟

interface FocusModeProps {
  onComplete?: (duration: FocusDuration, actualTime: number) => void;
  onClose?: () => void;
}

export function FocusMode({ onComplete, onClose }: FocusModeProps) {
  const [duration, setDuration] = useState<FocusDuration>(15);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="bg-background/95 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-2 border-primary/30">
        {/* 关闭按钮 */}
        {!isActive && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="关闭"
          >
            ✕
          </button>
        )}

        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">🎯 专注学习模式</h2>
          <p className="text-muted-foreground">选择专注时长，开始高效学习</p>
        </div>

        {/* 时间选择（未开始时显示） */}
        {!isActive && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {([5, 15, 30] as FocusDuration[]).map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setDuration(mins);
                  setTimeLeft(mins * 60);
                }}
                className={`
                  px-6 py-4 rounded-lg border-2 transition-all
                  ${duration === mins
                    ? 'border-primary bg-primary/10 text-primary font-bold scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                  }
                `}
              >
                <div className="text-2xl font-bold">{mins}</div>
                <div className="text-sm text-muted-foreground">分钟</div>
              </button>
            ))}
          </div>
        )}

        {/* 倒计时显示 */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* 圆形进度条 */}
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            
            {/* 时间文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-5xl font-bold mb-2">{formatTime(timeLeft)}</div>
                {isActive && (
                  <div className="text-sm text-muted-foreground">
                    {isPaused ? '已暂停' : '专注中...'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="px-8 py-6 text-lg font-bold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              ▶️ 开始专注
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                size="lg"
                variant="outline"
                className="px-6 py-4"
              >
                {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
              </Button>
              <Button
                onClick={handleStop}
                size="lg"
                variant="outline"
                className="px-6 py-4 border-red-500 text-red-600 hover:bg-red-50"
              >
                ⏹️ 停止
              </Button>
            </>
          )}
        </div>

        {/* 提示信息 */}
        {isActive && !isPaused && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            💡 提示：切换标签页会自动暂停，保持专注！
          </div>
        )}

        {/* 统计信息（暂停时显示） */}
        {isPaused && actualTimeSpent > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground mb-1">已专注时长</div>
            <div className="text-2xl font-bold">{formatTime(actualTimeSpent)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

