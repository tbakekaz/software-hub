export interface TypingAchievement {
  id: string;
  name: string;
  name_i18n?: {
    zh?: string;
    kk?: string;
    ru?: string;
    en?: string;
  };
  description: string;
  description_i18n?: {
    zh?: string;
    kk?: string;
    ru?: string;
    en?: string;
  };
  icon: string;
  condition: {
    type: 'wpm' | 'accuracy' | 'lessons' | 'time' | 'streak';
    value: number;
    language?: 'kazakh' | 'chinese' | 'russian' | 'english';
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const typingAchievements: TypingAchievement[] = [
  {
    id: 'first-typing',
    name: '第一次打字',
    name_i18n: {
      zh: '第一次打字',
      kk: 'Алғашқы теру',
      ru: 'Первая печать',
      en: 'First Typing',
    },
    description: '完成第一次打字练习',
    description_i18n: {
      zh: '完成第一次打字练习',
      kk: 'Алғашқы теру жаттығуын аяқтау',
      ru: 'Завершить первую практику печати',
      en: 'Complete your first typing practice',
    },
    icon: '🎯',
    condition: { type: 'lessons', value: 1 },
    rarity: 'common',
  },
  {
    id: 'speed-50',
    name: '速度新星',
    name_i18n: {
      zh: '速度新星',
      kk: 'Жылдамдық жұлдызы',
      ru: 'Звезда скорости',
      en: 'Speed Star',
    },
    description: '达到 50 WPM',
    description_i18n: {
      zh: '达到 50 WPM',
      kk: '50 WPM-ға жету',
      ru: 'Достичь 50 WPM',
      en: 'Reach 50 WPM',
    },
    icon: '⭐',
    condition: { type: 'wpm', value: 50 },
    rarity: 'common',
  },
  {
    id: 'speed-100',
    name: '速度大师',
    name_i18n: {
      zh: '速度大师',
      kk: 'Жылдамдық шебері',
      ru: 'Мастер скорости',
      en: 'Speed Master',
    },
    description: '达到 100 WPM',
    description_i18n: {
      zh: '达到 100 WPM',
      kk: '100 WPM-ға жету',
      ru: 'Достичь 100 WPM',
      en: 'Reach 100 WPM',
    },
    icon: '🚀',
    condition: { type: 'wpm', value: 100 },
    rarity: 'rare',
  },
  {
    id: 'accuracy-95',
    name: '精准射手',
    name_i18n: {
      zh: '精准射手',
      kk: 'Дәлдік мергені',
      ru: 'Снайпер точности',
      en: 'Accuracy Sniper',
    },
    description: '准确率达到 95%',
    description_i18n: {
      zh: '准确率达到 95%',
      kk: 'Дәлдік 95%',
      ru: 'Точность 95%',
      en: 'Reach 95% accuracy',
    },
    icon: '🎯',
    condition: { type: 'accuracy', value: 95 },
    rarity: 'rare',
  },
  {
    id: 'lessons-10',
    name: '勤奋学习者',
    name_i18n: {
      zh: '勤奋学习者',
      kk: 'Қызметті оқушы',
      ru: 'Усердный ученик',
      en: 'Diligent Learner',
    },
    description: '完成 10 个课程',
    description_i18n: {
      zh: '完成 10 个课程',
      kk: '10 курс аяқтау',
      ru: 'Завершить 10 курсов',
      en: 'Complete 10 lessons',
    },
    icon: '📚',
    condition: { type: 'lessons', value: 10 },
    rarity: 'common',
  },
  {
    id: 'lessons-50',
    name: '课程大师',
    name_i18n: {
      zh: '课程大师',
      kk: 'Курс шебері',
      ru: 'Мастер курсов',
      en: 'Course Master',
    },
    description: '完成 50 个课程',
    description_i18n: {
      zh: '完成 50 个课程',
      kk: '50 курс аяқтау',
      ru: 'Завершить 50 курсов',
      en: 'Complete 50 lessons',
    },
    icon: '👑',
    condition: { type: 'lessons', value: 50 },
    rarity: 'epic',
  },
  {
    id: 'time-60',
    name: '持久练习者',
    name_i18n: {
      zh: '持久练习者',
      kk: 'Тұрақты жаттығушы',
      ru: 'Постоянный практик',
      en: 'Persistent Practitioner',
    },
    description: '累计练习 60 分钟',
    description_i18n: {
      zh: '累计练习 60 分钟',
      kk: 'Жалпы 60 минут жаттығу',
      ru: 'Накопить 60 минут практики',
      en: 'Accumulate 60 minutes of practice',
    },
    icon: '⏰',
    condition: { type: 'time', value: 60 },
    rarity: 'rare',
  },
  {
    id: 'kazakh-master',
    name: '哈萨克语大师',
    name_i18n: {
      zh: '哈萨克语大师',
      kk: 'Қазақ тілі шебері',
      ru: 'Мастер казахского языка',
      en: 'Kazakh Master',
    },
    description: '完成所有哈萨克语课程',
    description_i18n: {
      zh: '完成所有哈萨克语课程',
      kk: 'Барлық қазақ тілі курстарын аяқтау',
      ru: 'Завершить все курсы казахского языка',
      en: 'Complete all Kazakh courses',
    },
    icon: '🇰🇿',
    condition: { type: 'lessons', value: 20, language: 'kazakh' },
    rarity: 'epic',
  },
  {
    id: 'chinese-master',
    name: '中文大师',
    name_i18n: {
      zh: '中文大师',
      kk: 'Қытай тілі шебері',
      ru: 'Мастер китайского языка',
      en: 'Chinese Master',
    },
    description: '完成所有中文课程',
    description_i18n: {
      zh: '完成所有中文课程',
      kk: 'Барлық қытай тілі курстарын аяқтау',
      ru: 'Завершить все курсы китайского языка',
      en: 'Complete all Chinese courses',
    },
    icon: '🇨🇳',
    condition: { type: 'lessons', value: 20, language: 'chinese' },
    rarity: 'epic',
  },
  {
    id: 'speed-150',
    name: '打字之神',
    name_i18n: {
      zh: '打字之神',
      kk: 'Теру құдайы',
      ru: 'Бог печати',
      en: 'Typing God',
    },
    description: '达到 150 WPM',
    description_i18n: {
      zh: '达到 150 WPM',
      kk: '150 WPM-ға жету',
      ru: 'Достичь 150 WPM',
      en: 'Reach 150 WPM',
    },
    icon: '⚡',
    condition: { type: 'wpm', value: 150 },
    rarity: 'legendary',
  },
];

export function checkAchievements(
  stats: {
    wpm: number;
    accuracy: number;
    lessonsCompleted: number;
    totalTime: number;
    language?: 'kazakh' | 'chinese' | 'russian' | 'english';
  },
  unlockedAchievements: string[]
): TypingAchievement[] {
  const newAchievements: TypingAchievement[] = [];

  for (const achievement of typingAchievements) {
    if (unlockedAchievements.includes(achievement.id)) continue;

    const { type, value, language } = achievement.condition;
    let conditionMet = false;

    if (language && stats.language && stats.language !== language) continue;

    switch (type) {
      case 'wpm':
        conditionMet = stats.wpm >= value;
        break;
      case 'accuracy':
        conditionMet = stats.accuracy >= value;
        break;
      case 'lessons':
        conditionMet = stats.lessonsCompleted >= value;
        break;
      case 'time':
        conditionMet = stats.totalTime >= value * 60; // 转换为秒
        break;
      case 'streak':
        // TODO: 实现连续练习天数
        conditionMet = false;
        break;
    }

    if (conditionMet) {
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

export function getUnlockedAchievements(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('typing_achievements');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function unlockAchievement(achievementId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const unlocked = getUnlockedAchievements();
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      localStorage.setItem('typing_achievements', JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Failed to unlock achievement:', error);
  }
}

