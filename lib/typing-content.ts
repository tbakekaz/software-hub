export type TypingLanguage = 'kazakh' | 'chinese' | 'russian' | 'english';
export type TypingDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TypingLesson {
  id: string;
  title: string;
  text: string;
  description?: string;
}

export interface TypingCourse {
  id: string;
  title: string;
  description?: string;
  language: TypingLanguage;
  difficulty: TypingDifficulty;
  lessons: TypingLesson[];
}

// 哈萨克语课程
const kazakhCourses: TypingCourse[] = [
  {
    id: 'kk-beginner-01',
    title: '基础字母练习',
    description: '学习哈萨克语基础字母',
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-01-01',
        title: '字母 A-Ә',
        text: 'А а Ә ә Б б В в Г г Ғ ғ Д д Е е Ё ё Ж ж З з И и Й й К к Қ қ Л л М м Н н Ң ң О о Ө ө П п Р р С с Т т У у Ұ ұ Ү ү Ф ф Х х Һ һ Ц ц Ч ч Ш ш Щ щ Ъ ъ Ы ы І і Ь ь Э э Ю ю Я я',
      },
      {
        id: 'kk-beginner-01-02',
        title: '常用单词',
        text: 'сәлем алайсың қалайсың рахмет кешіріңіз жарайды жақсы керемет',
      },
      {
        id: 'kk-beginner-01-03',
        title: '简单句子',
        text: 'Менің атым Айгүл. Сіз қалайсыз? Мен жақсымын. Рахмет.',
      },
    ],
  },
  {
    id: 'kk-intermediate-01',
    title: '日常对话',
    description: '日常对话练习',
    language: 'kazakh',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'kk-intermediate-01-01',
        title: '问候与介绍',
        text: 'Сәлеметсіз бе! Менің атым Нұрлан. Мен студентпін. Сіз не істейсіз? Мен мұғаліммін. Қандай мамандық? Мен информатика оқимын.',
      },
      {
        id: 'kk-intermediate-01-02',
        title: '购物对话',
        text: 'Бұл қанша тұрады? Бұл бес мың теңге. Барлығы неше? Барлығы он мың теңге. Рахмет, келесі жолы кездескенше.',
      },
    ],
  },
  {
    id: 'kk-advanced-01',
    title: '专业文章',
    description: '专业术语和长文章',
    language: 'kazakh',
    difficulty: 'advanced',
    lessons: [
      {
        id: 'kk-advanced-01-01',
        title: '科技文章',
        text: 'Қазақстанда цифрлық технологиялардың дамуы жыл сайын жылдамдап келеді. Білім беру саласында онлайн оқыту жүйелері кеңінен қолданылады. Бұл студенттерге кез келген уақытта және жерде білім алуға мүмкіндік береді.',
      },
    ],
  },
];

// 中文课程
const chineseCourses: TypingCourse[] = [
  {
    id: 'zh-beginner-01',
    title: '拼音练习',
    description: '学习中文拼音',
    language: 'chinese',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'zh-beginner-01-01',
        title: '声母练习',
        text: 'b p m f d t n l g k h j q x zh ch sh r z c s y w',
      },
      {
        id: 'zh-beginner-01-02',
        title: '常用字',
        text: '你好 谢谢 对不起 再见 请 是的 不是 好的',
      },
      {
        id: 'zh-beginner-01-03',
        title: '简单句子',
        text: '你好，我叫小明。你叫什么名字？很高兴认识你。谢谢你的帮助。',
      },
    ],
  },
  {
    id: 'zh-intermediate-01',
    title: '日常对话',
    description: '日常对话练习',
    language: 'chinese',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'zh-intermediate-01-01',
        title: '购物对话',
        text: '这个多少钱？这个五十元。一共多少钱？一共一百元。谢谢，再见。',
      },
      {
        id: 'zh-intermediate-01-02',
        title: '餐厅点餐',
        text: '你好，我想点餐。我要一份宫保鸡丁和一碗米饭。还要别的吗？再来一杯可乐。好的，请稍等。',
      },
    ],
  },
  {
    id: 'zh-advanced-01',
    title: '专业文章',
    description: '专业术语和长文章',
    language: 'chinese',
    difficulty: 'advanced',
    lessons: [
      {
        id: 'zh-advanced-01-01',
        title: '科技文章',
        text: '人工智能技术的发展正在改变我们的生活方式。机器学习、深度学习等技术的应用越来越广泛。这些技术不仅提高了工作效率，还为解决复杂问题提供了新的思路和方法。',
      },
    ],
  },
];

// 俄语课程
const russianCourses: TypingCourse[] = [
  {
    id: 'ru-beginner-01',
    title: '基础字母',
    description: '学习俄语字母',
    language: 'russian',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'ru-beginner-01-01',
        title: '字母表',
        text: 'А а Б б В в Г г Д д Е е Ё ё Ж ж З з И и Й й К к Л л М м Н н О о П п Р р С с Т т У у Ф ф Х х Ц ц Ч ч Ш ш Щ щ Ъ ъ Ы ы Ь ь Э э Ю ю Я я',
      },
      {
        id: 'ru-beginner-01-02',
        title: '常用单词',
        text: 'привет спасибо пожалуйста извините хорошо отлично',
      },
      {
        id: 'ru-beginner-01-03',
        title: '简单句子',
        text: 'Меня зовут Иван. Как дела? У меня всё хорошо. Спасибо.',
      },
    ],
  },
  {
    id: 'ru-intermediate-01',
    title: '日常对话',
    description: '日常对话练习',
    language: 'russian',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'ru-intermediate-01-01',
        title: '问候与介绍',
        text: 'Здравствуйте! Меня зовут Анна. Я студентка. Чем вы занимаетесь? Я работаю учителем. Какая специальность? Я изучаю информатику.',
      },
    ],
  },
  {
    id: 'ru-advanced-01',
    title: '专业文章',
    description: '专业术语和长文章',
    language: 'russian',
    difficulty: 'advanced',
    lessons: [
      {
        id: 'ru-advanced-01-01',
        title: '科技文章',
        text: 'Развитие цифровых технологий в Казахстане ускоряется с каждым годом. В сфере образования широко используются системы онлайн-обучения. Это позволяет студентам получать знания в любое время и в любом месте.',
      },
    ],
  },
];

// 英语课程
const englishCourses: TypingCourse[] = [
  {
    id: 'en-beginner-01',
    title: '基础字母',
    description: '学习英语字母',
    language: 'english',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'en-beginner-01-01',
        title: '字母表',
        text: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z',
      },
      {
        id: 'en-beginner-01-02',
        title: '常用单词',
        text: 'hello thank you please sorry goodbye yes no good great',
      },
      {
        id: 'en-beginner-01-03',
        title: '简单句子',
        text: 'Hello, my name is John. How are you? I am fine, thank you. Nice to meet you.',
      },
    ],
  },
  {
    id: 'en-intermediate-01',
    title: '日常对话',
    description: '日常对话练习',
    language: 'english',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'en-intermediate-01-01',
        title: '问候与介绍',
        text: 'Hello! My name is Sarah. I am a student. What do you do? I work as a teacher. What is your major? I study computer science.',
      },
      {
        id: 'en-intermediate-01-02',
        title: '购物对话',
        text: 'How much does this cost? This is fifty dollars. How much is everything? Everything is one hundred dollars. Thank you, see you next time.',
      },
    ],
  },
  {
    id: 'en-advanced-01',
    title: '专业文章',
    description: '专业术语和长文章',
    language: 'english',
    difficulty: 'advanced',
    lessons: [
      {
        id: 'en-advanced-01-01',
        title: '科技文章',
        text: 'The development of digital technologies in Kazakhstan is accelerating every year. Online learning systems are widely used in the field of education. This allows students to acquire knowledge at any time and in any place.',
      },
    ],
  },
];

export function getTypingCourses(language: TypingLanguage, difficulty: TypingDifficulty): TypingCourse[] {
  let allCourses: TypingCourse[] = [];
  
  switch (language) {
    case 'kazakh':
      allCourses = kazakhCourses;
      break;
    case 'chinese':
      allCourses = chineseCourses;
      break;
    case 'russian':
      allCourses = russianCourses;
      break;
    case 'english':
      allCourses = englishCourses;
      break;
  }
  
  return allCourses.filter(course => course.difficulty === difficulty);
}

export function getAllTypingCourses(language?: TypingLanguage): TypingCourse[] {
  if (language) {
    switch (language) {
      case 'kazakh':
        return kazakhCourses;
      case 'chinese':
        return chineseCourses;
      case 'russian':
        return russianCourses;
      case 'english':
        return englishCourses;
    }
  }
  
  return [...kazakhCourses, ...chineseCourses, ...russianCourses, ...englishCourses];
}

