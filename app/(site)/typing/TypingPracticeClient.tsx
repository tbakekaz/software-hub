'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CardBase, CardHeader, CardBody } from '@/components/CardBase';
import type { Lang } from '@/lib/i18n';
import { getTypingCourses, type TypingCourse, type TypingLesson } from '@/lib/typing-content';
import { saveTypingProgress, getTypingStats, type TypingStats } from '@/lib/typing-progress';
import { checkAchievements, unlockAchievement, getUnlockedAchievements, type TypingAchievement } from '@/lib/typing-achievements';
import { pickLocaleString } from '@/lib/i18n/translate';
import { KeyboardLayout } from '@/components/KeyboardLayout';
import { TypingLeaderboard } from '@/components/TypingLeaderboard';
import { arabicToCyrillic, cyrillicToArabic, normalizeForCompare, type KazakhScript } from '@/lib/kazakh-convert';

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
    leaderboard?: string;
    rank?: string;
    date?: string;
    noRecords?: string;
    allTime?: string;
    today?: string;
    thisWeek?: string;
    thisMonth?: string;
    minutes?: string;
    seconds?: string;
    practiceMode?: string;
    level?: {
      beginner?: string;
      intermediate?: string;
      advanced?: string;
    };
  };
  lang: Lang;
}

export function TypingPracticeClient({ dict, lang }: Props) {
  // 多语言后备值辅助函数
  const t = (key: string, fallbacks: { zh: string; kk: string; ru: string; en: string }): string => {
    const dictValue = (dict as any)?.[key];
    if (dictValue) return dictValue;
    return fallbacks[lang] || fallbacks.zh;
  };

  const [selectedLanguage, setSelectedLanguage] = useState<'kazakh' | 'chinese' | 'russian' | 'english'>('kazakh');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedCourse, setSelectedCourse] = useState<TypingCourse | null>(null);
  const [currentLesson, setCurrentLesson] = useState<TypingLesson | null>(null);
  const [practiceMode, setPracticeMode] = useState<'free' | 'course' | 'speed' | 'accuracy'>('course');
  const [showKeyboard, setShowKeyboard] = useState(true); // 默认显示键盘
  const [timeLimit, setTimeLimit] = useState(60); // 速度测试时间限制（秒）
  const [targetAccuracy, setTargetAccuracy] = useState(95); // 准确率挑战目标
  // 哈萨克语脚本切换：新疆阿拉伯（arabic） / 哈国西里尔（cyrillic）
  const [kazakhScript, setKazakhScript] = useState<KazakhScript>('cyrillic');
  // 文字转换器（入口）
  const [showConverter, setShowConverter] = useState(false);
  const [converterMode, setConverterMode] = useState<'a2c' | 'c2a'>('a2c');
  const [converterInput, setConverterInput] = useState('');
  
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [newAchievements, setNewAchievements] = useState<TypingAchievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  
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

  // 加载统计数据和成就
  useEffect(() => {
    setStats(getTypingStats(selectedLanguage));
    setUnlockedAchievements(getUnlockedAchievements());
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

  // 速度测试模式：时间限制
  useEffect(() => {
    if (practiceMode === 'speed' && isActive && startTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed >= timeLimit) {
          setIsActive(false);
          setIsCompleted(true);
          const finalStats = calculateStats();
          saveTypingProgress({
            language: selectedLanguage,
            difficulty: selectedDifficulty,
            wpm: finalStats.wpm,
            accuracy: finalStats.accuracy,
            time: finalStats.time,
            errors: errors,
            lessonId: currentLesson?.id || 'speed-test',
            completedAt: new Date().toISOString(),
          });
          setStats(getTypingStats(selectedLanguage));
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [practiceMode, isActive, startTime, timeLimit]);

  // 准确率挑战模式：检查准确率
  useEffect(() => {
    if (practiceMode === 'accuracy' && isActive && userInput.length > 0) {
      const currentAccuracy = displayStats.accuracy;
      if (currentAccuracy < targetAccuracy && userInput.length > text.length * 0.5) {
        // 如果准确率低于目标且已输入超过一半，提示
        // 可以在这里添加警告提示
      }
    }
  }, [practiceMode, isActive, displayStats.accuracy, targetAccuracy, userInput, text]);

  // 显示与比较统一
  const displayDir = selectedLanguage === 'kazakh' && kazakhScript === 'arabic' ? 'rtl' : 'ltr';
  const normalizedTarget = selectedLanguage === 'kazakh' ? normalizeForCompare(text, kazakhScript) : text;

  // 处理输入
  const handleInput = (value: string) => {
    if (!isActive && value.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setUserInput(value);
    
    // 检查错误（哈萨克语下将双方统一到西里尔再比较）
    let newErrors = 0;
    if (selectedLanguage === 'kazakh') {
      const normalizedInput = normalizeForCompare(value, kazakhScript);
      for (let i = 0; i < normalizedInput.length; i++) {
        if (i >= normalizedTarget.length || normalizedInput[i] !== normalizedTarget[i]) {
          newErrors++;
        }
      }
    } else {
      for (let i = 0; i < value.length; i++) {
        if (i >= text.length || value[i] !== text[i]) {
          newErrors++;
        }
      }
    }
    setErrors(newErrors);
    setCurrentIndex(value.length);

    // 检查完成（课程模式和自由模式）
    const isCompletedMatch = selectedLanguage === 'kazakh'
      ? normalizeForCompare(value, kazakhScript) === normalizedTarget
      : value === text;
    if ((practiceMode === 'course' || practiceMode === 'free') && isCompletedMatch) {
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
        
        const updatedStats = getTypingStats(selectedLanguage);
        setStats(updatedStats);
        
        // 检查成就
        const achievements = checkAchievements(
          {
            wpm: finalStats.wpm,
            accuracy: finalStats.accuracy,
            lessonsCompleted: updatedStats.lessonsCompleted,
            totalTime: updatedStats.totalTime,
            language: selectedLanguage,
          },
          unlockedAchievements
        );
        
        if (achievements.length > 0) {
          achievements.forEach(ach => unlockAchievement(ach.id));
          setNewAchievements(achievements);
          setUnlockedAchievements(getUnlockedAchievements());
        }
      }
    }
    
    // 准确率挑战模式：检查是否达到目标准确率
    if (practiceMode === 'accuracy' && isCompletedMatch) {
      const finalStats = calculateStats();
      if (finalStats.accuracy >= targetAccuracy) {
        setIsActive(false);
        setIsCompleted(true);
        if (startTime) {
          saveTypingProgress({
            language: selectedLanguage,
            difficulty: selectedDifficulty,
            wpm: finalStats.wpm,
            accuracy: finalStats.accuracy,
            time: finalStats.time,
            errors: errors,
            lessonId: currentLesson?.id || 'accuracy-challenge',
            completedAt: new Date().toISOString(),
          });
          setStats(getTypingStats(selectedLanguage));
        }
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
    setNewAchievements([]);
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

  // 渲染文本（高亮正确/错误）- 参考 typingstudy.com 效果
  const renderText = () => {
    const chars = text.split('');
    return chars.map((char, index) => {
      let className = '';
      if (index < currentIndex) {
        // 已输入的字符：正确=绿色，错误=红色背景+下划线
        let isCorrect = false;
        if (selectedLanguage === 'kazakh') {
          const normalizedInput = normalizeForCompare(userInput.slice(0, index + 1), kazakhScript);
          const target = normalizedTarget.slice(0, index + 1);
          isCorrect = normalizedInput[normalizedInput.length - 1] === target[target.length - 1];
        } else {
          isCorrect = userInput[index] === char;
        }
        if (isCorrect) {
          className = 'text-green-600 dark:text-green-400';
        } else {
          className = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/30 underline decoration-red-500 decoration-2';
        }
      } else if (index === currentIndex) {
        // 当前字符：明显的下划线高亮（参考 typingstudy.com）
        className = 'bg-blue-100 dark:bg-blue-950/30 border-b-4 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 font-semibold';
      } else {
        // 未输入的字符：灰色
        className = 'text-gray-400 dark:text-gray-500';
      }
      return (
        <span key={index} className={`inline-block ${className}`}>
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
        <h1 className="text-3xl font-bold">{t('title', { zh: '打字练习', kk: 'Теру жаттығуы', ru: 'Практика набора', en: 'Typing Practice' })}</h1>
        <p className="text-muted-foreground">{t('subtitle', { zh: '提升打字速度和准确率', kk: 'Теру жылдамдығы мен дәлдігін арттыру', ru: 'Повышение скорости и точности набора', en: 'Improve typing speed and accuracy' })}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 左侧：设置面板 */}
        <div className="space-y-4">
          <CardBase>
            <CardHeader>
              <h2 className="text-lg font-semibold">{t('selectLanguage', { zh: '选择语言', kk: 'Тілді таңдау', ru: 'Выбор языка', en: 'Select Language' })}</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {(['kazakh', 'chinese', 'russian', 'english'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setSelectedCourse(null);
                      setCurrentLesson(null);
                      handleRestart();
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
                      selectedLanguage === lang
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {lang === 'kazakh' ? 'Қазақша' : lang === 'chinese' ? '中文' : lang === 'russian' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
              {/* 文字转换器入口（在语言选择卡片中也提供一处，确保可见） */}
              {selectedLanguage === 'kazakh' && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowConverter(true)}
                    className="px-3 py-1.5 text-sm rounded-lg border hover:bg-muted"
                    title="سايكەستىرگىش / Сайкестіргіш"
                  >
                    سايكەستىرگىش / Сайкестіргіш
                  </button>
                </div>
              )}
            </CardBody>
          </CardBase>

          <CardBase>
            <CardHeader>
              <h2 className="text-lg font-semibold">{t('selectDifficulty', { zh: '选择难度', kk: 'Қиындықты таңдау', ru: 'Выбор сложности', en: 'Select Difficulty' })}</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty);
                      setSelectedCourse(null);
                      setCurrentLesson(null);
                      handleRestart();
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
                      selectedDifficulty === difficulty
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {difficulty === 'beginner' 
                      ? (dict?.level?.beginner || (lang === 'zh' ? '初级' : lang === 'kk' ? 'Бастапқы' : lang === 'ru' ? 'Начальный' : 'Beginner'))
                      : difficulty === 'intermediate'
                      ? (dict?.level?.intermediate || (lang === 'zh' ? '中级' : lang === 'kk' ? 'Орта' : lang === 'ru' ? 'Средний' : 'Intermediate'))
                      : (dict?.level?.advanced || (lang === 'zh' ? '高级' : lang === 'kk' ? 'Жоғары' : lang === 'ru' ? 'Продвинутый' : 'Advanced'))}
                  </button>
                ))}
              </div>
            </CardBody>
          </CardBase>

          {courses.length > 0 && (
            <CardBase>
              <CardHeader>
                <h2 className="text-lg font-semibold">{t('selectCourse', { zh: '选择课程', kk: 'Курсты таңдау', ru: 'Выбор курса', en: 'Select Course' })}</h2>
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
                    {typeof course.title === 'string' ? course.title : pickLocaleString(course.title, lang)}
                  </button>
                ))}
              </CardBody>
            </CardBase>
          )}

          {/* 统计信息 */}
          {stats && (
            <CardBase>
              <CardHeader>
                <h2 className="text-lg font-semibold">{t('yourStats', { zh: '您的统计', kk: 'Сіздің статистикаңыз', ru: 'Ваша статистика', en: 'Your Statistics' })}</h2>
              </CardHeader>
              <CardBody className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('averageSpeed', { zh: '平均速度', kk: 'Орташа жылдамдық', ru: 'Средняя скорость', en: 'Average Speed' })}:</span>
                  <span className="font-semibold">{stats.averageWpm} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('bestSpeed', { zh: '最高速度', kk: 'Ең жоғары жылдамдық', ru: 'Максимальная скорость', en: 'Best Speed' })}:</span>
                  <span className="font-semibold">{stats.bestWpm} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('totalPractice', { zh: '总练习时长', kk: 'Жалпы жаттығу уақыты', ru: 'Общее время практики', en: 'Total Practice Time' })}:</span>
                  <span className="font-semibold">{Math.floor(stats.totalTime / 60)} {t('minutes', { zh: '分钟', kk: 'минут', ru: 'минут', en: 'minutes' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('lessonsCompleted', { zh: '完成课程', kk: 'Аяқталған сабақтар', ru: 'Завершенные уроки', en: 'Lessons Completed' })}:</span>
                  <span className="font-semibold">{stats.lessonsCompleted}</span>
                </div>
              </CardBody>
            </CardBase>
          )}
        </div>

        {/* 中间：练习区域 */}
        <div className="md:col-span-2 space-y-4">
          {/* 练习模式选择 */}
          <CardBase>
            <CardHeader>
              <h2 className="text-lg font-semibold">{t('practiceMode', { zh: '练习模式', kk: 'Жаттығу режимі', ru: 'Режим практики', en: 'Practice Mode' })}</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    setPracticeMode('course');
                    handleRestart();
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    practiceMode === 'course'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {t('courseMode', { zh: '课程模式', kk: 'Курс режимі', ru: 'Режим курса', en: 'Course Mode' })}
                </button>
                <button
                  onClick={() => {
                    setPracticeMode('free');
                    setText('');
                    handleRestart();
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    practiceMode === 'free'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {t('freePractice', { zh: '自由练习', kk: 'Еркін жаттығу', ru: 'Свободная практика', en: 'Free Practice' })}
                </button>
                <button
                  onClick={() => {
                    setPracticeMode('speed');
                    handleRestart();
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    practiceMode === 'speed'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {t('speedTest', { zh: '速度测试', kk: 'Жылдамдық тесті', ru: 'Тест скорости', en: 'Speed Test' })}
                </button>
                <button
                  onClick={() => {
                    setPracticeMode('accuracy');
                    handleRestart();
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    practiceMode === 'accuracy'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {t('accuracyChallenge', { zh: '准确率挑战', kk: 'Дәлдік сынағы', ru: 'Испытание точности', en: 'Accuracy Challenge' })}
                </button>
              </div>
              
              {practiceMode === 'speed' && (
                <div className="mt-4 flex items-center gap-2">
                  <label className="text-sm">{t('time', { zh: '时间限制', kk: 'Уақыт шегі', ru: 'Ограничение времени', en: 'Time Limit' })}:</label>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="px-3 py-1 border rounded"
                  >
                    <option value={30}>30 {t('seconds', { zh: '秒', kk: 'секунд', ru: 'секунд', en: 'seconds' })}</option>
                    <option value={60}>1 {t('minutes', { zh: '分钟', kk: 'минут', ru: 'минут', en: 'minutes' })}</option>
                    <option value={120}>2 {t('minutes', { zh: '分钟', kk: 'минут', ru: 'минут', en: 'minutes' })}</option>
                    <option value={300}>5 {t('minutes', { zh: '分钟', kk: 'минут', ru: 'минут', en: 'minutes' })}</option>
                  </select>
                </div>
              )}
              
              {practiceMode === 'accuracy' && (
                <div className="mt-4 flex items-center gap-2">
                  <label className="text-sm">{t('accuracy', { zh: '目标准确率', kk: 'Мақсатты дәлдік', ru: 'Целевая точность', en: 'Target Accuracy' })}:</label>
                  <select
                    value={targetAccuracy}
                    onChange={(e) => setTargetAccuracy(Number(e.target.value))}
                    className="px-3 py-1 border rounded"
                  >
                    <option value={90}>90%</option>
                    <option value={95}>95%</option>
                    <option value={98}>98%</option>
                    <option value={100}>100%</option>
                  </select>
                </div>
              )}
              
              {practiceMode === 'free' && (
                <div className="mt-4">
                  <textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      handleRestart();
                    }}
                    placeholder={lang === 'zh' ? '输入自定义练习文本...' : lang === 'kk' ? 'Теңдестірілген мәтін енгізіңіз...' : lang === 'ru' ? 'Введите свой текст...' : 'Enter custom text...'}
                    className="w-full p-3 border rounded-lg min-h-[100px]"
                  />
                </div>
              )}
            </CardBody>
          </CardBase>

          <CardBase>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {currentLesson?.title 
                    ? (typeof currentLesson.title === 'string' ? currentLesson.title : pickLocaleString(currentLesson.title, lang))
                    : t('freePractice', { zh: '自由练习', kk: 'Еркін жаттығу', ru: 'Свободная практика', en: 'Free Practice' })}
                </h2>
                <div className="flex items-center gap-2">
                  {/* 脚本切换（仅哈萨克语时显示） */}
                  {selectedLanguage === 'kazakh' && (
                    <div className="hidden md:flex items-center gap-1">
                      <button
                        onClick={() => setKazakhScript('cyrillic')}
                        className={`px-2 py-1 text-xs rounded border ${kazakhScript === 'cyrillic' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                        title={lang === 'kk' ? 'Кирилл (Қазақстан)' : lang === 'ru' ? 'Кириллица (Казахстан)' : lang === 'en' ? 'Cyrillic (Kazakhstan)' : '西里尔（哈萨克斯坦）'}
                      >
                        {lang === 'kk' ? 'Кирилл' : lang === 'ru' ? 'Кириллица' : lang === 'en' ? 'Cyrillic' : '西里尔'}
                      </button>
                      <button
                        onClick={() => setKazakhScript('arabic')}
                        className={`px-2 py-1 text-xs rounded border ${kazakhScript === 'arabic' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                        title={lang === 'kk' ? 'Араб (Шыңжаң қазақ)' : lang === 'ru' ? 'Арабский (Синьцзян-Казахский)' : lang === 'en' ? 'Arabic (Xinjiang Kazakh)' : '阿拉伯（新疆哈萨克）'}
                      >
                        {lang === 'kk' ? 'Араб' : lang === 'ru' ? 'Арабский' : lang === 'en' ? 'Arabic' : '阿拉伯'}
                      </button>
                    </div>
                  )}
                  {/* 文字转换器入口 */}
                  {selectedLanguage === 'kazakh' && (
                    <button
                      onClick={() => setShowConverter(true)}
                      className="px-3 py-1 text-sm border rounded hover:bg-muted"
                      title="سايكەستىرگىش / Сайкестіргіш"
                    >
                      سايكەستىرگىش / Сайкестіргіш
                    </button>
                  )}
                  <button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="px-3 py-1 text-sm border rounded hover:bg-muted"
                  >
                    {showKeyboard ? (lang === 'zh' ? '隐藏键盘' : lang === 'kk' ? 'Пернетақтаны жасыру' : lang === 'ru' ? 'Скрыть клавиатуру' : 'Hide Keyboard') : (lang === 'zh' ? '显示键盘' : lang === 'kk' ? 'Пернетақтаны көрсету' : lang === 'ru' ? 'Показать клавиатуру' : 'Show Keyboard')}
                  </button>
                  {currentLesson && (
                    <span className="text-sm text-muted-foreground">
                      {currentLessonIndex + 1} / {selectedCourse?.lessons.length || 0}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* 统计显示 */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayStats.wpm}</div>
                  <div className="text-xs text-muted-foreground">{t('wpm', { zh: 'WPM', kk: 'WPM', ru: 'WPM', en: 'WPM' })}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayStats.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">{t('accuracy', { zh: '准确率', kk: 'Дәлдік', ru: 'Точность', en: 'Accuracy' })}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{displayStats.time}s</div>
                  <div className="text-xs text-muted-foreground">{t('time', { zh: '时间', kk: 'Уақыт', ru: 'Время', en: 'Time' })}</div>
                </div>
              </div>

              {/* 速度测试倒计时 */}
              {practiceMode === 'speed' && isActive && startTime && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {timeLimit - Math.floor((Date.now() - startTime) / 1000)}s
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {lang === 'zh' ? '剩余时间' : lang === 'kk' ? 'Қалған уақыт' : lang === 'ru' ? 'Осталось времени' : 'Time Remaining'}
                  </div>
                </div>
              )}

              {/* 准确率挑战提示 */}
              {practiceMode === 'accuracy' && isActive && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="text-sm font-semibold mb-1">
                    {lang === 'zh' ? '目标准确率' : lang === 'kk' ? 'Мақсатты дәлдік' : lang === 'ru' ? 'Целевая точность' : 'Target Accuracy'}: {targetAccuracy}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === 'zh' ? '当前准确率' : lang === 'kk' ? 'Ағымдағы дәлдік' : lang === 'ru' ? 'Текущая точность' : 'Current Accuracy'}: {displayStats.accuracy}%
                  </div>
                </div>
              )}

              {/* 文本显示区域 - 参考 typingstudy.com 样式 */}
              <div dir={displayDir} className={`p-8 bg-white dark:bg-gray-900 rounded-lg min-h-[250px] text-xl leading-relaxed font-mono border-2 border-gray-200 dark:border-gray-700 shadow-sm ${displayDir === 'rtl' ? 'text-right' : ''}`}>
                {text ? renderText() : (
                  <p className="text-muted-foreground text-center">
                    {lang === 'zh' ? '请在自由练习模式下输入自定义文本' : lang === 'kk' ? 'Еркін жаттығу режимінде теңдестірілген мәтін енгізіңіз' : lang === 'ru' ? 'Введите свой текст в режиме свободной практики' : 'Enter custom text in free practice mode'}
                  </p>
                )}
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
                dir={displayDir}
                className={`w-full p-4 border rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary ${displayDir === 'rtl' ? 'text-right' : ''}`}
                placeholder={t('start', { zh: '开始打字...', kk: 'Теруді бастау...', ru: 'Начать печатать...', en: 'Start typing...' })}
                disabled={isCompleted}
                autoFocus
              />

              {/* 键盘布局（默认显示在文本和输入框下方，参考 typingstudy.com） */}
              {showKeyboard && (
                <div className="mt-6">
                  <KeyboardLayout
                    currentKey={text[currentIndex] || undefined}
                    language={selectedLanguage}
                    lang={lang}
                    showFingerHints={true}
                  />
                </div>
              )}

              {/* 控制按钮 */}
              <div className="flex gap-2">
                <Button onClick={handleRestart} variant="outline" className="flex-1">
                  {t('restart', { zh: '重新开始', kk: 'Қайта бастау', ru: 'Начать заново', en: 'Restart' })}
                </Button>
                {currentLesson && (
                  <>
                    <Button
                      onClick={handlePreviousLesson}
                      variant="outline"
                      disabled={currentLessonIndex === 0}
                    >
                      {t('previousLesson', { zh: '上一课', kk: 'Алдыңғы сабақ', ru: 'Предыдущий урок', en: 'Previous Lesson' })}
                    </Button>
                    <Button
                      onClick={handleNextLesson}
                      variant="outline"
                      disabled={currentLessonIndex === (selectedCourse?.lessons.length || 0) - 1}
                    >
                      {t('nextLesson', { zh: '下一课', kk: 'Келесі сабақ', ru: 'Следующий урок', en: 'Next Lesson' })}
                    </Button>
                  </>
                )}
              </div>

              {/* 完成提示 */}
              {isCompleted && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                      🎉 {t('congratulations', { zh: '恭喜完成！', kk: 'Құттықтаймыз!', ru: 'Поздравляем!', en: 'Congratulations!' })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('wpm', { zh: 'WPM', kk: 'WPM', ru: 'WPM', en: 'WPM' })}: {displayStats.wpm} | {t('accuracy', { zh: '准确率', kk: 'Дәлдік', ru: 'Точность', en: 'Accuracy' })}: {displayStats.accuracy}% | {t('errors', { zh: '错误', kk: 'Қателер', ru: 'Ошибки', en: 'Errors' })}: {errors}
                    </p>
                  </div>
                  
                  {/* 新成就提示 */}
                  {newAchievements.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm font-semibold mb-2">🏆 {t('achievements', { zh: '新成就解锁！', kk: 'Жаңа жетістіктер ашылды!', ru: 'Новые достижения разблокированы!', en: 'New Achievements Unlocked!' })}</p>
                      <div className="space-y-2">
                        {newAchievements.map((ach) => (
                          <div key={ach.id} className="flex items-center gap-2 p-2 bg-background/50 rounded">
                            <span className="text-2xl">{ach.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium">{pickLocaleString(ach.name_i18n || ach.name, lang)}</p>
                              <p className="text-xs text-muted-foreground">
                                {pickLocaleString(ach.description_i18n || ach.description, lang)}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              ach.rarity === 'legendary' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                              ach.rarity === 'epic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              ach.rarity === 'rare' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {ach.rarity === 'legendary' 
                                ? (lang === 'kk' ? 'Аңызға айналған' : lang === 'ru' ? 'Легендарный' : lang === 'en' ? 'Legendary' : '传说')
                                : ach.rarity === 'epic'
                                ? (lang === 'kk' ? 'Эпос' : lang === 'ru' ? 'Эпический' : lang === 'en' ? 'Epic' : '史诗')
                                : ach.rarity === 'rare'
                                ? (lang === 'kk' ? 'Сирек' : lang === 'ru' ? 'Редкий' : lang === 'en' ? 'Rare' : '稀有')
                                : (lang === 'kk' ? 'Қарапайым' : lang === 'ru' ? 'Обычный' : lang === 'en' ? 'Common' : '普通')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </CardBase>
        </div>
      </div>

      {/* 文字转换器对话框 */}
      {showConverter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConverter(false)} />
          <div className="relative bg-background rounded-xl shadow-2xl border w-full max-w-3xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                {lang === 'kk'
                  ? 'Мәтін түрлендіргіш (қазақ: араб ↔ кирилл)'
                  : '文字转换器（哈萨克：阿拉伯 ↔ 西里尔）'}
              </h3>
              <button className="px-2 py-1 rounded hover:bg-muted" onClick={() => setShowConverter(false)}>✕</button>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConverterMode('a2c')}
                      className={`px-3 py-1.5 text-sm rounded border ${converterMode === 'a2c' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                    >
                      {lang === 'kk' ? 'Араб → Кирилл' : '阿拉伯 → 西里尔'}
                    </button>
                    <button
                      onClick={() => setConverterMode('c2a')}
                      className={`px-3 py-1.5 text-sm rounded border ${converterMode === 'c2a' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                    >
                      {lang === 'kk' ? 'Кирилл → Араб' : '西里尔 → 阿拉伯'}
                    </button>
                  </div>
                </div>
                <textarea
                  dir={converterMode === 'a2c' ? 'rtl' : 'ltr'}
                  lang={converterMode === 'a2c' ? 'kk-Arab' : 'kk'}
                  placeholder={
                    converterMode === 'a2c'
                      ? (lang === 'kk' ? 'Араб жазуын енгізіңіз (Шыңжаң қазақ)...' : '输入阿拉伯文（新疆哈萨克）...')
                      : (lang === 'kk' ? 'Кирилл жазуын енгізіңіз (Қазақстан)...' : '输入西里尔文（哈萨克斯坦）...')
                  }
                  className={`w-full min-h-[140px] p-3 border rounded text-base leading-relaxed ${
                    converterMode === 'a2c' 
                      ? 'text-right font-sans'
                      : 'text-left font-mono'
                  }`}
                  style={converterMode === 'a2c' ? { 
                    direction: 'rtl',
                    textAlign: 'right',
                    unicodeBidi: 'plaintext' as any,
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", "Noto Naskh Arabic", "Noto Sans Arabic", sans-serif'
                  } : {}}
                  value={converterInput}
                  onChange={(e) => setConverterInput(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {lang === 'kk' ? 'Түрлендіру нәтижесі' : '转换结果'}
                  </span>
                  <button
                    className="px-2 py-1 text-xs border rounded hover:bg-muted"
                    onClick={() => {
                      const output = converterMode === 'a2c'
                        ? arabicToCyrillic(converterInput)
                        : cyrillicToArabic(converterInput);
                      navigator.clipboard.writeText(output);
                    }}
                  >
                    {lang === 'kk' ? 'Көшіру' : '复制'}
                  </button>
                </div>
                <div
                  dir={converterMode === 'c2a' ? 'rtl' : 'ltr'}
                  lang={converterMode === 'c2a' ? 'kk-Arab' : 'kk'}
                  className={`w-full min-h-[140px] p-3 border rounded bg-muted/40 whitespace-pre-wrap break-words text-base leading-relaxed ${
                    converterMode === 'c2a' 
                      ? 'text-right font-sans'
                      : 'text-left font-mono'
                  }`}
                  style={converterMode === 'c2a' ? { 
                    direction: 'rtl',
                    textAlign: 'right',
                    unicodeBidi: 'plaintext' as any,
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", "Noto Naskh Arabic", "Noto Sans Arabic", sans-serif'
                  } : {}}
                >
                  {converterMode === 'a2c'
                    ? arabicToCyrillic(converterInput || '')
                    : cyrillicToArabic(converterInput || '')}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {lang === 'kk'
                ? 'Ескерту: түрлендіру алгоритмі жетілдірілді, екі бағытта жұмыс істейді. Қате байқалса, мысал жіберіңіз.'
                : '提示：转换算法已优化，支持双向转换。如发现错误，请提供具体例子以便进一步改进。'}
            </div>
          </div>
        </div>
      )}

      {/* 排行榜 */}
      <div className="mt-6">
        <TypingLeaderboard lang={lang} dict={dict} />
      </div>
    </main>
  );
}

