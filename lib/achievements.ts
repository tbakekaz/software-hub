'use client';

export type Achievement = {
  id: string;
  name: string;
  name_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  description: string;
  description_i18n?: { zh?: string; kk?: string; ru?: string; en?: string };
  icon: string; // emoji 或图标
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: {
    type: 'courses_completed' | 'stars_collected' | 'time_spent' | 'streak' | 'category_master' | 'language_master';
    value: number;
    targetLanguage?: string;
    category?: string;
  };
};

export const achievements: Achievement[] = [
  {
    id: 'first_step',
    name: '第一步',
    name_i18n: {
      zh: '第一步',
      en: 'First Step',
      kk: 'Бірінші қадам',
      ru: 'Первый шаг'
    },
    description: '完成第一个课程',
    description_i18n: {
      zh: '完成第一个课程',
      en: 'Complete your first course',
      kk: 'Бірінші курсты аяқтау',
      ru: 'Завершите первый курс'
    },
    icon: '🎯',
    rarity: 'common',
    condition: { type: 'courses_completed', value: 1 }
  },
  {
    id: 'star_collector',
    name: '星星收集者',
    name_i18n: {
      zh: '星星收集者',
      en: 'Star Collector',
      kk: 'Жұлдыз жинаушы',
      ru: 'Собиратель звезд'
    },
    description: '收集100颗星星',
    description_i18n: {
      zh: '收集100颗星星',
      en: 'Collect 100 stars',
      kk: '100 жұлдыз жинау',
      ru: 'Соберите 100 звезд'
    },
    icon: '⭐',
    rarity: 'rare',
    condition: { type: 'stars_collected', value: 100 }
  },
  {
    id: 'english_master',
    name: '英语大师',
    name_i18n: {
      zh: '英语大师',
      en: 'English Master',
      kk: 'Ағылшын шебері',
      ru: 'Мастер английского'
    },
    description: '完成所有英语课程',
    description_i18n: {
      zh: '完成所有英语课程',
      en: 'Complete all English courses',
      kk: 'Барлық ағылшын курстарын аяқтау',
      ru: 'Завершите все курсы английского'
    },
    icon: '🏆',
    rarity: 'legendary',
    condition: { type: 'language_master', value: 1, targetLanguage: 'english' }
  },
  {
    id: 'week_warrior',
    name: '周战士',
    name_i18n: {
      zh: '周战士',
      en: 'Week Warrior',
      kk: 'Апталық жауынгер',
      ru: 'Недельный воин'
    },
    description: '连续学习7天',
    description_i18n: {
      zh: '连续学习7天',
      en: 'Study for 7 consecutive days',
      kk: '7 күн бойы үздіксіз оқу',
      ru: 'Учитесь 7 дней подряд'
    },
    icon: '🔥',
    rarity: 'epic',
    condition: { type: 'streak', value: 7 }
  },
  {
    id: 'grammar_guru',
    name: '语法大师',
    name_i18n: {
      zh: '语法大师',
      en: 'Grammar Guru',
      kk: 'Грамматика шебері',
      ru: 'Гуру грамматики'
    },
    description: '完成10个语法课程',
    description_i18n: {
      zh: '完成10个语法课程',
      en: 'Complete 10 grammar courses',
      kk: '10 грамматика курсын аяқтау',
      ru: 'Завершите 10 курсов грамматики'
    },
    icon: '📚',
    rarity: 'rare',
    condition: { type: 'category_master', value: 10, category: 'grammar' }
  },
  {
    id: 'focus_master',
    name: '专注大师',
    name_i18n: {
      zh: '专注大师',
      en: 'Focus Master',
      kk: 'Назар шебері',
      ru: 'Мастер фокуса'
    },
    description: '完成10次专注学习',
    description_i18n: {
      zh: '完成10次专注学习',
      en: 'Complete 10 focus sessions',
      kk: '10 назар сессиясын аяқтау',
      ru: 'Завершите 10 сессий фокуса'
    },
    icon: '🎯',
    rarity: 'epic',
    condition: { type: 'courses_completed', value: 10 }
  }
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(a => a.id === id);
}

