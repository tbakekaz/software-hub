'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CardBase, CardHeader, CardBody } from '@/components/CardBase';
import type { Lang } from '@/lib/i18n';
import { getTypingCourses, type TypingCourse, type TypingLesson } from '@/lib/typing-content';
import { saveTypingProgress, getTypingStats, type TypingStats } from '@/lib/typing-progress';

interface Props {
  dict?: {
    title?: string;
    subtitle?: string;
    selectLanguage?: string;
    selectDifficulty?: string;
    selectCourse?: string;
    wpm?: string;
    accuracy?: string;
    time?: string;
    errors?: string;
    start?: string;
    restart?: string;
    nextLesson?: string;
    previousLesson?: string;
    completed?: string;
    congratulations?: string;
    yourStats?: string;
    averageSpeed?: string;
    bestSpeed?: string;
    totalPractice?: string;
    lessonsCompleted?: string;
    currentLevel?: string;
    achievements?: string;
    freePractice?: string;
    courseMode?: string;
    speedTest?: string;
    accuracyChallenge?: string;
  };
  lang: Lang;
}

export function TypingPracticeClient({ dict, lang }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<'kazakh' | 'chinese' | 'russian' | 'english'>('kazakh');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedCourse, setSelectedCourse] = useState<TypingCourse | null>(null);
  const [currentLesson, setCurrentLesson] = useState<TypingLesson | null>(null);
  const [practiceMode, setPracticeMode] = useState<'free' | 'course' | 'speed' | 'accuracy'>('course');
  
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<TypingStats | null>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 加载课程数据
  useEffect(() => {
    const courses = getTypingCourses(selectedLanguage, selectedDifficulty);
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
      setCurrentLesson(courses[0].lessons[0]);
      setText(courses[0].lessons[0].text);
    }
  }, [selectedLanguage, selectedDifficulty, selectedCourse]);

  // 加载统计数据
  useEffect(() => {
    setStats(getTypingStats(selectedLanguage));
  }, [selectedLanguage]);

  // 计算统计信息
  const calculateStats = useCallback(() => {
    if (!startTime || !isActive) return { wpm: 0, accuracy: 100, time: 0 };
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // 分钟
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    const totalChars = text.length;
    const correctChars = totalChars - errors;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const time = Math.round((Date.now() - startTime) / 1000);
    
    return { wpm, accuracy, time };
  }, [startTime, isActive, userInput, text, errors]);

  const [displayStats, setDisplayStats] = useState({ wpm: 0, accuracy: 100, time: 0 });

  // 实时更新统计
  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        setDisplayStats(calculateStats());
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, startTime, calculateStats]);

  // 处理输入
  const handleInput = (value: string) => {
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setUserInput(value);
    
    // 检查错误
    let newErrors = 0;
    for (let i = 0; i < value.length; i++) {
      if (i >= text.length || value[i] !== text[i]) {
        newErrors++;
      }
    }
    setErrors(newErrors);
    setCurrentIndex(value.length);

    // 检查完成
    if (value === text) {
      setIsActive(false);
      setIsCompleted(true);
      if (startTime) {
        const finalStats = calculateStats();
        saveTypingProgress({
          language: selectedLanguage,
          difficulty: selectedDifficulty,
          wpm: finalStats.wpm,
          accuracy: finalStats.accuracy,
          time: finalStats.time,
          errors: errors,
          lessonId: currentLesson?.id || '',
          completedAt: new Date().toISOString(),
        });
        setStats(getTypingStats(selectedLanguage));
      }
    }
  };

  // 重新开始
  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setIsActive(false);
    setIsCompleted(false);
    setErrors(0);
    setCurrentIndex(0);
    setDisplayStats({ wpm: 0, accuracy: 100, time: 0 });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 下一个课程
  const handleNextLesson = () => {
    if (!selectedCourse) return;
    const currentIndex = selectedCourse.lessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < selectedCourse.lessons.length - 1) {
      const nextLesson = selectedCourse.lessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
      setText(nextLesson.text);
      handleRestart();
    }
  };

  // 上一个课程
  const handlePreviousLesson = () => {
    if (!selectedCourse) return;
    const currentIndex = selectedCourse.lessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex > 0) {
      const prevLesson = selectedCourse.lessons[currentIndex - 1];
      setCurrentLesson(prevLesson);
      setText(prevLesson.text);
      handleRestart();
    }
  };

  // 渲染文本（高亮正确/错误）
  const renderText = () => {
    const chars = text.split('');
    return chars.map((char, index) => {
      let className = 'text-muted-foreground';
      if (index < currentIndex) {
        className = userInput[index] === char ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20';
      } else if (index === currentIndex) {
        className = 'bg-primary/20 border-b-2 border-primary';
      }
      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const courses = getTypingCourses(selectedLanguage, selectedDifficulty);
  const currentLessonIndex = selectedCourse ? selectedCourse.lessons.findIndex(l => l.id === currentLesson?.id) : -1;

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict?.title || '打字练习'}</h1>
        <p className="text-muted-foreground">{dict?.subtitle || '提升打字速度和准确率'}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 左侧：设置面板 */}
        <div className="space-y-4">
          <CardBase>
            <CardHeader>
              <h2 className="text-lg font-semibold">{dict?.selectLanguage || '选择语言'}</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {(['kazakh', 'chinese', 'russian', 'english'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setSelectedCourse(null);
                    setCurrentLesson(null);
                    handleRestart();
                  }}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {lang === 'kazakh' ? 'Қазақша' : lang === 'chinese' ? '中文' : lang === 'russian' ? 'Русский' : 'English'}
                </button>
              ))}
            </CardBody>
          </CardBase>

          <CardBase>
            <CardHeader>
              <h2 className="text-lg font-semibold">{dict?.selectDifficulty || '选择难度'}</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => {
                    setSelectedDifficulty(difficulty);
                    setSelectedCourse(null);
                    setCurrentLesson(null);
                    handleRestart();
                  }}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {difficulty === 'beginner' ? '初级' : difficulty === 'intermediate' ? '中级' : '高级'}
                </button>
              ))}
            </CardBody>
          </CardBase>

          {courses.length > 0 && (
            <CardBase>
              <CardHeader>
                <h2 className="text-lg font-semibold">{dict?.selectCourse || '选择课程'}</h2>
              </CardHeader>
              <CardBody className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setCurrentLesson(course.lessons[0]);
                      setText(course.lessons[0].text);
                      handleRestart();
                    }}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors text-left ${
                      selectedCourse?.id === course.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </CardBody>
            </CardBase>
          )}

          {/* 统计信息 */}
          {stats && (
            <CardBase>
              <CardHeader>
                <h2 className="text-lg font-semibold">{dict?.yourStats || '您的统计'}</h2>
              </CardHeader>
              <CardBody className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{dict?.averageSpeed || '平均速度'}:</span>
                  <span className="font-semibold">{stats.averageWpm} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{dict?.bestSpeed || '最高速度'}:</span>
                  <span className="font-semibold">{stats.bestWpm} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{dict?.totalPractice || '总练习时长'}:</span>
                  <span className="font-semibold">{Math.floor(stats.totalTime / 60)} 分钟</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{dict?.lessonsCompleted || '完成课程'}:</span>
                  <span className="font-semibold">{stats.lessonsCompleted}</span>
                </div>
              </CardBody>
            </CardBase>
          )}
        </div>

        {/* 中间：练习区域 */}
        <div className="md:col-span-2 space-y-4">
          <CardBase>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {currentLesson?.title || dict?.freePractice || '自由练习'}
                </h2>
                {currentLesson && (
                  <span className="text-sm text-muted-foreground">
                    {currentLessonIndex + 1} / {selectedCourse?.lessons.length || 0}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* 统计显示 */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayStats.wpm}</div>
                  <div className="text-xs text-muted-foreground">{dict?.wpm || 'WPM'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayStats.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">{dict?.accuracy || '准确率'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayStats.time}s</div>
                  <div className="text-xs text-muted-foreground">{dict?.time || '时间'}</div>
                </div>
              </div>

              {/* 文本显示区域 */}
              <div className="p-6 bg-muted/30 rounded-lg min-h-[200px] text-lg leading-relaxed font-mono">
                {renderText()}
              </div>

              {/* 输入区域 */}
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => handleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                  }
                }}
                className="w-full p-4 border rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={dict?.start || '开始打字...'}
                disabled={isCompleted}
                autoFocus
              />

              {/* 控制按钮 */}
              <div className="flex gap-2">
                <Button onClick={handleRestart} variant="outline" className="flex-1">
                  {dict?.restart || '重新开始'}
                </Button>
                {currentLesson && (
                  <>
                    <Button
                      onClick={handlePreviousLesson}
                      variant="outline"
                      disabled={currentLessonIndex === 0}
                    >
                      {dict?.previousLesson || '上一课'}
                    </Button>
                    <Button
                      onClick={handleNextLesson}
                      variant="outline"
                      disabled={currentLessonIndex === (selectedCourse?.lessons.length || 0) - 1}
                    >
                      {dict?.nextLesson || '下一课'}
                    </Button>
                  </>
                )}
              </div>

              {/* 完成提示 */}
              {isCompleted && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                  <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                    🎉 {dict?.congratulations || '恭喜完成！'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {dict?.wpm || 'WPM'}: {displayStats.wpm} | {dict?.accuracy || '准确率'}: {displayStats.accuracy}% | {dict?.errors || '错误'}: {errors}
                  </p>
                </div>
              )}
            </CardBody>
          </CardBase>
        </div>
      </div>
    </main>
  );
}

