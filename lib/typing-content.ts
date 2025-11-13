export type TypingLanguage = 'kazakh' | 'chinese' | 'russian' | 'english';
export type TypingDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TypingLesson {
  id: string;
  title: string | { zh?: string; kk?: string; ru?: string; en?: string };
  text: string;
  description?: string | { zh?: string; kk?: string; ru?: string; en?: string };
}

export interface TypingCourse {
  id: string;
  title: string | { zh?: string; kk?: string; ru?: string; en?: string };
  description?: string | { zh?: string; kk?: string; ru?: string; en?: string };
  language: TypingLanguage;
  difficulty: TypingDifficulty;
  lessons: TypingLesson[];
}

// 哈萨克语课程
const kazakhCourses: TypingCourse[] = [
  {
    id: 'kk-beginner-01',
    title: { zh: '基础字母练习', kk: 'Негізгі әріптер жаттығуы', ru: 'Базовые буквы', en: 'Basic Alphabet Practice' },
    description: { zh: '学习哈萨克语基础字母', kk: 'Қазақ тілінің негізгі әріптерін үйрену', ru: 'Изучение базовых букв казахского языка', en: 'Learn basic Kazakh alphabet' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-01-01',
        title: { zh: '字母 A-Ә', kk: 'Әріптер A-Ә', ru: 'Буквы A-Ә', en: 'Letters A-Ә' },
        text: 'А а Ә ә Б б В в Г г Ғ ғ Д д Е е Ё ё Ж ж З з И и Й й К к Қ қ Л л М м Н н Ң ң О о Ө ө П п Р р С с Т т У у Ұ ұ Ү ү Ф ф Х х Һ һ Ц ц Ч ч Ш ш Щ щ Ъ ъ Ы ы І і Ь ь Э э Ю ю Я я',
      },
      {
        id: 'kk-beginner-01-02',
        title: { zh: '常用单词', kk: 'Жиі қолданылатын сөздер', ru: 'Часто используемые слова', en: 'Common Words' },
        text: 'сәлем алайсың қалайсың рахмет кешіріңіз жарайды жақсы керемет',
      },
      {
        id: 'kk-beginner-01-03',
        title: { zh: '简单句子', kk: 'Қарапайым сөйлемдер', ru: 'Простые предложения', en: 'Simple Sentences' },
        text: 'Менің атым Айгүл. Сіз қалайсыз? Мен жақсымын. Рахмет.',
      },
    ],
  },
  {
    id: 'kk-intermediate-01',
    title: { zh: '日常对话', kk: 'Күнделікті әңгіме', ru: 'Повседневный диалог', en: 'Daily Conversation' },
    description: { zh: '日常对话练习', kk: 'Күнделікті әңгіме жаттығуы', ru: 'Практика повседневного диалога', en: 'Daily conversation practice' },
    language: 'kazakh',
    difficulty: 'intermediate',
    lessons: [
      {
        id: 'kk-intermediate-01-01',
        title: { zh: '问候与介绍', kk: 'Сәлемдесу және таныстыру', ru: 'Приветствие и знакомство', en: 'Greetings and Introductions' },
        text: 'Сәлеметсіз бе! Менің атым Нұрлан. Мен студентпін. Сіз не істейсіз? Мен мұғаліммін. Қандай мамандық? Мен информатика оқимын.',
      },
      {
        id: 'kk-intermediate-01-02',
        title: { zh: '购物对话', kk: 'Сатып алу әңгімесі', ru: 'Диалог о покупках', en: 'Shopping Dialogue' },
        text: 'Бұл қанша тұрады? Бұл бес мың теңге. Барлығы неше? Барлығы он мың теңге. Рахмет, келесі жолы кездескенше.',
      },
    ],
  },
  {
    id: 'kk-advanced-01',
    title: { zh: '专业文章', kk: 'Кәсіби мақалалар', ru: 'Профессиональные статьи', en: 'Professional Articles' },
    description: { zh: '专业术语和长文章', kk: 'Кәсіби терминдер мен ұзын мақалалар', ru: 'Профессиональные термины и длинные статьи', en: 'Professional terms and long articles' },
    language: 'kazakh',
    difficulty: 'advanced',
    lessons: [
      {
        id: 'kk-advanced-01-01',
        title: { zh: '科技文章', kk: 'Ғылыми-техникалық мақала', ru: 'Научно-техническая статья', en: 'Science & Technology Article' },
        text: 'Қазақстанда цифрлық технологиялардың дамуы жыл сайын жылдамдап келеді. Білім беру саласында онлайн оқыту жүйелері кеңінен қолданылады. Бұл студенттерге кез келген уақытта және жерде білім алуға мүмкіндік береді.',
      },
      {
        id: 'kk-advanced-01-02',
        title: { zh: '商务文章', kk: 'Бизнес мақаласы', ru: 'Бизнес-статья', en: 'Business Article' },
        text: 'Бизнес әлемінде тиімді басқару мен стратегиялық жоспарлау маңызды рөл атқарады. Компаниялар нарықта бәсекелестік артықшылыққа ие болу үшін инновациялық шешімдерді іздеуі керек.',
      },
      {
        id: 'kk-advanced-01-03',
        title: { zh: '文化文章', kk: 'Мәдениет мақаласы', ru: 'Статья о культуре', en: 'Culture Article' },
        text: 'Қазақ мәдениеті бай дәстүрлер мен заманауи құндылықтарды біріктіреді. Ұлттық музыка, әндер, билер мен дәстүрлі киімдер қазақ халқының мәдени мұрасының маңызды бөлігі болып табылады.',
      },
    ],
  },
  {
    id: 'kk-beginner-02',
    title: { zh: '基本单词练习', kk: 'Негізгі сөздер жаттығуы', ru: 'Базовые слова', en: 'Basic Words Practice' },
    description: { zh: '练习常用哈萨克语单词', kk: 'Жиі қолданылатын қазақ сөздерін жаттығу', ru: 'Практика часто используемых казахских слов', en: 'Practice common Kazakh words' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-02-01',
        title: { zh: '家庭词汇', kk: 'Отбасы сөздері', ru: 'Семейные слова', en: 'Family Words' },
        text: 'әке ана аға әпке бауыр бала немере',
      },
      {
        id: 'kk-beginner-02-02',
        title: { zh: '颜色词汇', kk: 'Түстер', ru: 'Цвета', en: 'Colors' },
        text: 'қызыл көк сары жасыл қара ақ күміс алтын',
      },
      {
        id: 'kk-beginner-02-03',
        title: { zh: '数字词汇', kk: 'Сандар', ru: 'Числа', en: 'Numbers' },
        text: 'бір екі үш төрт бес алты жеті сегіз тоғыз он',
      },
    ],
  },
  {
    id: 'kk-beginner-03',
    title: { zh: '简单句子练习', kk: 'Қарапайым сөйлемдер', ru: 'Простые предложения', en: 'Simple Sentences' },
    description: { zh: '练习基本句子结构', kk: 'Негізгі сөйлем құрылымын жаттығу', ru: 'Практика базовой структуры предложений', en: 'Practice basic sentence structure' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-03-01',
        title: { zh: '自我介绍', kk: 'Өзімді таныстыру', ru: 'Знакомство', en: 'Self Introduction' },
        text: 'Менің атым Асхат. Мен Астанада тұрамын. Мен студентпін.',
      },
      {
        id: 'kk-beginner-03-02',
        title: { zh: '日常活动', kk: 'Күнделікті іс-әрекеттер', ru: 'Повседневные действия', en: 'Daily Activities' },
        text: 'Мен таңертең оянамын. Мен таңғы ас ішемін. Мен мектепке барамын.',
      },
      {
        id: 'kk-beginner-03-03',
        title: { zh: '天气描述', kk: 'Ауа райы', ru: 'Погода', en: 'Weather' },
        text: 'Бүгін күн ашық. Күн жылы. Ауа райы жақсы.',
      },
    ],
  },
  {
    id: 'kk-beginner-04',
    title: { zh: '特殊字母练习', kk: 'Арнайы әріптер', ru: 'Специальные буквы', en: 'Special Letters' },
    description: { zh: '学习哈萨克语特殊字母', kk: 'Қазақ тілінің арнайы әріптерін үйрену', ru: 'Изучение специальных букв казахского языка', en: 'Learn special Kazakh letters' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-04-01',
        title: { zh: 'Ә, І, Ң, Ғ', kk: 'Ә, І, Ң, Ғ', ru: 'Ә, І, Ң, Ғ', en: 'Ә, І, Ң, Ғ' },
        text: 'әке әпке әйел әдемі ішкі ішінде іздеу ңұрт ңұртта ңұрттың ғалым ғылым ғимарат',
      },
      {
        id: 'kk-beginner-04-02',
        title: { zh: 'Ү, Ұ, Қ, Ө', kk: 'Ү, Ұ, Қ, Ө', ru: 'Ү, Ұ, Қ, Ө', en: 'Ү, Ұ, Қ, Ө' },
        text: 'үй үйде үйіңіз ұл ұлт ұлттық қала қазақ қазақстан өмір өнер өзен',
      },
      {
        id: 'kk-beginner-04-03',
        title: { zh: 'Һ 字母', kk: 'Һ әрпі', ru: 'Буква Һ', en: 'Letter Һ' },
        text: 'һәм һауа һауасы һауа райы',
      },
    ],
  },
  {
    id: 'kk-beginner-05',
    title: { zh: '常用短语', kk: 'Жиі қолданылатын сөз тіркестері', ru: 'Часто используемые фразы', en: 'Common Phrases' },
    description: { zh: '练习日常使用的短语', kk: 'Күнделікті қолданылатын сөз тіркестерін жаттығу', ru: 'Практика повседневных фраз', en: 'Practice everyday phrases' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-05-01',
        title: { zh: '问候短语', kk: 'Сәлемдесу сөздері', ru: 'Приветствия', en: 'Greetings' },
        text: 'Сәлеметсіз бе! Қалайсыз? Жақсысыз ба? Кешіріңіз. Рахмет.',
      },
      {
        id: 'kk-beginner-05-02',
        title: { zh: '感谢和道歉', kk: 'Рахмет және кешірім', ru: 'Благодарность и извинения', en: 'Thanks and Apologies' },
        text: 'Рахмет сізге. Кешіріңіз. Ешқандай. Жарайды. Болды.',
      },
      {
        id: 'kk-beginner-05-03',
        title: { zh: '时间和日期', kk: 'Уақыт және күн', ru: 'Время и дата', en: 'Time and Date' },
        text: 'Қанша уақыт? Бүгін дүйсенбі. Ертең сейсенбі. Кеше жексенбі.',
      },
    ],
  },
  {
    id: 'kk-beginner-06',
    title: { zh: '动词练习', kk: 'Етістіктер', ru: 'Глаголы', en: 'Verbs' },
    description: { zh: '学习常用动词', kk: 'Жиі қолданылатын етістіктерді үйрену', ru: 'Изучение часто используемых глаголов', en: 'Learn common verbs' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-06-01',
        title: { zh: '基本动词', kk: 'Негізгі етістіктер', ru: 'Базовые глаголы', en: 'Basic Verbs' },
        text: 'бару келу алу беру ішу жеу оқу жазу',
      },
      {
        id: 'kk-beginner-06-02',
        title: { zh: '动作动词', kk: 'Қимыл етістіктері', ru: 'Глаголы движения', en: 'Action Verbs' },
        text: 'жүгіру секіру жүзу ұшу жүру көру есту',
      },
      {
        id: 'kk-beginner-06-03',
        title: { zh: '动词句子', kk: 'Етістік сөйлемдері', ru: 'Предложения с глаголами', en: 'Verb Sentences' },
        text: 'Мен мектепке барамын. Сіз кітап оқыдыңыз. Ол су ішіп жатыр.',
      },
    ],
  },
  {
    id: 'kk-beginner-07',
    title: { zh: '名词练习', kk: 'Зат есімдер', ru: 'Существительные', en: 'Nouns' },
    description: { zh: '学习常用名词', kk: 'Жиі қолданылатын зат есімдерді үйрену', ru: 'Изучение часто используемых существительных', en: 'Learn common nouns' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-07-01',
        title: { zh: '人物名词', kk: 'Адам зат есімдері', ru: 'Существительные о людях', en: 'People Nouns' },
        text: 'мұғалім студент дәрігер инженер жұмысшы оқушы бала',
      },
      {
        id: 'kk-beginner-07-02',
        title: { zh: '地点名词', kk: 'Орын зат есімдері', ru: 'Существительные о местах', en: 'Place Nouns' },
        text: 'мектеп университет аурухана дүкен ресторан парк кітапхана',
      },
      {
        id: 'kk-beginner-07-03',
        title: { zh: '物品名词', kk: 'Заттар', ru: 'Предметы', en: 'Objects' },
        text: 'кітап дәптер қалам компьютер телефон машина үй кітапхана',
      },
    ],
  },
  {
    id: 'kk-beginner-08',
    title: { zh: '形容词练习', kk: 'Сын есімдер', ru: 'Прилагательные', en: 'Adjectives' },
    description: { zh: '学习常用形容词', kk: 'Жиі қолданылатын сын есімдерді үйрену', ru: 'Изучение часто используемых прилагательных', en: 'Learn common adjectives' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-08-01',
        title: { zh: '大小和颜色', kk: 'Өлшем және түс', ru: 'Размер и цвет', en: 'Size and Color' },
        text: 'үлкен кіші ұзын қысқа қызыл көк сары жасыл',
      },
      {
        id: 'kk-beginner-08-02',
        title: { zh: '品质形容词', kk: 'Сапа сын есімдері', ru: 'Качественные прилагательные', en: 'Quality Adjectives' },
        text: 'жақсы нашар әдемі әдемі ескі жаңа таза лас',
      },
      {
        id: 'kk-beginner-08-03',
        title: { zh: '形容词句子', kk: 'Сын есім сөйлемдері', ru: 'Предложения с прилагательными', en: 'Adjective Sentences' },
        text: 'Бұл үлкен үй. Ол әдемі қыз. Менің жаңа кітабым бар.',
      },
    ],
  },
  {
    id: 'kk-beginner-09',
    title: { zh: '数字和计数', kk: 'Сандар және санау', ru: 'Числа и счет', en: 'Numbers and Counting' },
    description: { zh: '练习数字和计数', kk: 'Сандар мен санауды жаттығу', ru: 'Практика чисел и счета', en: 'Practice numbers and counting' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-09-01',
        title: { zh: '1-20', kk: '1-20', ru: '1-20', en: '1-20' },
        text: 'бір екі үш төрт бес алты жеті сегіз тоғыз он он бір он екі он үш он төрт он бес он алты он жеті он сегіз он тоғыз жиырма',
      },
      {
        id: 'kk-beginner-09-02',
        title: { zh: '10的倍数', kk: 'Ондық сандар', ru: 'Кратные десяти', en: 'Multiples of Ten' },
        text: 'он жиырма отыз қырық елу алпыс жетпіс сексен тоқсан жүз',
      },
      {
        id: 'kk-beginner-09-03',
        title: { zh: '数字句子', kk: 'Сан сөйлемдері', ru: 'Предложения с числами', en: 'Number Sentences' },
        text: 'Менде бес кітап бар. Ол он екі жаста. Бүгін жиырма бесінші күн.',
      },
    ],
  },
  {
    id: 'kk-beginner-10',
    title: { zh: '疑问句练习', kk: 'Сұраулы сөйлемдер', ru: 'Вопросительные предложения', en: 'Question Sentences' },
    description: { zh: '学习如何提问', kk: 'Қалай сұрау қоюды үйрену', ru: 'Изучение как задавать вопросы', en: 'Learn how to ask questions' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-10-01',
        title: { zh: '基本疑问词', kk: 'Негізгі сұрау сөздері', ru: 'Базовые вопросительные слова', en: 'Basic Question Words' },
        text: 'кім не қайда қашан қалай неге қанша',
      },
      {
        id: 'kk-beginner-10-02',
        title: { zh: '疑问句', kk: 'Сұраулы сөйлемдер', ru: 'Вопросительные предложения', en: 'Questions' },
        text: 'Сіз кімсіз? Сіз не істейсіз? Сіз қайда тұрасыз? Қанша уақыт?',
      },
      {
        id: 'kk-beginner-10-03',
        title: { zh: '回答疑问句', kk: 'Сұрауға жауап беру', ru: 'Ответы на вопросы', en: 'Answering Questions' },
        text: 'Мен студентпін. Мен оқимын. Мен Астанада тұрамын. Екі сағат.',
      },
    ],
  },
  {
    id: 'kk-beginner-11',
    title: { zh: '复杂句子结构', kk: 'Күрделі сөйлем құрылымы', ru: 'Сложная структура предложений', en: 'Complex Sentence Structure' },
    description: { zh: '学习更复杂的句子', kk: 'Күрделі сөйлемдерді үйрену', ru: 'Изучение более сложных предложений', en: 'Learn more complex sentences' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-11-01',
        title: { zh: '复合句', kk: 'Күрделі сөйлемдер', ru: 'Сложные предложения', en: 'Compound Sentences' },
        text: 'Мен оқимын, ал ол жұмыс істейді. Бүгін күн ашық, бірақ ертең жаңбыр болады. Сіз келдіңіз, сондықтан біз бастаймыз.',
      },
      {
        id: 'kk-beginner-11-02',
        title: { zh: '时间从句', kk: 'Уақыт бағыныңқы сөйлемдері', ru: 'Временные придаточные', en: 'Time Clauses' },
        text: 'Мен оқыған кезде, ол жұмыс істеді. Сіз келгенде, біз тамақ ішіп жатырмыз. Ол келгенге дейін, біз күтеміз.',
      },
      {
        id: 'kk-beginner-11-03',
        title: { zh: '原因和结果', kk: 'Себеп және нәтиже', ru: 'Причина и следствие', en: 'Cause and Effect' },
        text: 'Ол кешікті, сондықтан біз бастамадық. Жаңбыр жауып тұрғандықтан, біз үйде қалдық. Ол шаршаған, сондықтан демалды.',
      },
    ],
  },
  {
    id: 'kk-beginner-12',
    title: { zh: '时态练习', kk: 'Уақыт шақтары', ru: 'Времена', en: 'Tenses' },
    description: { zh: '学习不同时态', kk: 'Әртүрлі уақыт шақтарын үйрену', ru: 'Изучение различных времен', en: 'Learn different tenses' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-12-01',
        title: { zh: '现在时', kk: 'Осы шақ', ru: 'Настоящее время', en: 'Present Tense' },
        text: 'Мен оқимын. Сіз жұмыс істейсіз. Ол ойнайды. Біз көреміз. Сіздер тыңдайсыздар. Олар айтады.',
      },
      {
        id: 'kk-beginner-12-02',
        title: { zh: '过去时', kk: 'Өткен шақ', ru: 'Прошедшее время', en: 'Past Tense' },
        text: 'Мен оқыдым. Сіз жұмыс істедіңіз. Ол ойнады. Біз көрдік. Сіздер тыңдадыңыздар. Олар айтты.',
      },
      {
        id: 'kk-beginner-12-03',
        title: { zh: '将来时', kk: 'Келер шақ', ru: 'Будущее время', en: 'Future Tense' },
        text: 'Мен оқитын боламын. Сіз жұмыс істейтін боласыз. Ол ойнайтын болады. Біз көретін боламыз. Сіздер тыңдайтын боласыздар. Олар айтатын болады.',
      },
    ],
  },
  {
    id: 'kk-beginner-13',
    title: { zh: '长文本练习', kk: 'Ұзын мәтін жаттығуы', ru: 'Длинный текст', en: 'Long Text Practice' },
    description: { zh: '练习输入长文本', kk: 'Ұзын мәтін енгізуді жаттығу', ru: 'Практика ввода длинного текста', en: 'Practice typing long text' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-13-01',
        title: { zh: '故事段落', kk: 'Әңгіме абзацы', ru: 'Параграфы рассказа', en: 'Story Paragraphs' },
        text: 'Бір күні Асхат мектепке барды. Ол жаңа оқушылармен танысты. Олар ойын ойнады және көп күлді. Күні бойы олар бірге болды. Асхат өте қуанышты болды.',
      },
      {
        id: 'kk-beginner-13-02',
        title: { zh: '描述性文本', kk: 'Сипаттамалық мәтін', ru: 'Описательный текст', en: 'Descriptive Text' },
        text: 'Астана қаласы өте әдемі. Онда көптеген үлкен ғимараттар бар. Қаланың ортасында үлкен парк бар. Паркта көптеген ағаштар мен гүлдер өседі. Адамдар мұнда демалып, жүріп-тұруға ұнайды.',
      },
      {
        id: 'kk-beginner-13-03',
        title: { zh: '说明性文本', kk: 'Түсіндірме мәтін', ru: 'Объяснительный текст', en: 'Explanatory Text' },
        text: 'Компьютер қазіргі заманда өте маңызды. Ол бізге көптеген мүмкіндіктер береді. Біз компьютерде жұмыс істей аламыз, ойын ойнай аламыз және ақпарат таба аламыз. Компьютер білім алу үшін де пайдалы.',
      },
    ],
  },
  {
    id: 'kk-beginner-14',
    title: { zh: '标点符号和格式', kk: 'Тыныс белгілері және пішім', ru: 'Знаки препинания и форматирование', en: 'Punctuation and Formatting' },
    description: { zh: '学习标点符号的使用', kk: 'Тыныс белгілерін қолдануды үйрену', ru: 'Изучение использования знаков препинания', en: 'Learn punctuation usage' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-14-01',
        title: { zh: '基本标点', kk: 'Негізгі тыныс белгілері', ru: 'Основные знаки препинания', en: 'Basic Punctuation' },
        text: 'Сәлеметсіз бе! Менің атым Асхат. Сіз қалайсыз? Мен жақсымын. Рахмет!',
      },
      {
        id: 'kk-beginner-14-02',
        title: { zh: '逗号和句号', kk: 'Үтір және нүкте', ru: 'Запятая и точка', en: 'Comma and Period' },
        text: 'Мен оқимын, ол жұмыс істейді, ал біз ойнаймыз. Бүгін күн ашық, жылы, әдемі. Ол келді, тамақ ішті, содан кейін кетті.',
      },
      {
        id: 'kk-beginner-14-03',
        title: { zh: '引号和括号', kk: 'Тырнақша және жақша', ru: 'Кавычки и скобки', en: 'Quotes and Parentheses' },
        text: 'Ол: "Сәлеметсіз бе!" деді. Мен (Астанада) тұрамын. "Қалайсыз?" деп сұрады.',
      },
    ],
  },
  {
    id: 'kk-beginner-15',
    title: { zh: '所有按键综合练习', kk: 'Жаңа пернелер: Барлық пернелер', ru: 'Новые клавиши: Все клавиши', en: 'New Keys: All Keys' },
    description: { zh: '综合所有键盘按键的完整练习', kk: 'Барлық пернетақта пернелерінің толық жаттығуы', ru: 'Полная практика всех клавиш клавиатуры', en: 'Complete practice of all keyboard keys' },
    language: 'kazakh',
    difficulty: 'beginner',
    lessons: [
      {
        id: 'kk-beginner-15-01',
        title: { zh: '新按键练习', kk: 'Жаңа пернелер жаттығуы', ru: 'Упражнение на новые клавиши', en: 'New Keys Exercise' },
        text: ') ( ! " ә і ң ғ ; , : . ү ұ қ ө һ',
      },
      {
        id: 'kk-beginner-15-02',
        title: { zh: '按键练习', kk: 'Пернелер жаттығуы', ru: 'Упражнение на клавиши', en: 'Keys Exercise' },
        text: 'й ц у к е н г ш щ з х ъ / \\ Caps ф ы в а п р о л д ж э Enter Shift | \\ я ч с м и т ь б ю ? № Shift Ctrl Alt AltGr Ctrl',
      },
      {
        id: 'kk-beginner-15-03',
        title: { zh: '单词练习 1', kk: 'Сөздер жаттығуы 1', ru: 'Упражнение на слова 1', en: 'Words Exercise 1' },
        text: 'әке әпке әйел әдемі ішкі ішінде іздеу ңұрт ңұртта ңұрттың ғалым ғылым ғимарат үй үйде үйіңіз ұл ұлт ұлттық қала қазақ қазақстан өмір өнер өзен',
      },
      {
        id: 'kk-beginner-15-04',
        title: { zh: '单词练习 2', kk: 'Сөздер жаттығуы 2', ru: 'Упражнение на слова 2', en: 'Words Exercise 2' },
        text: 'һәм һауа һауасы һауа райы мектеп университет студент мұғалім оқушы кітап дәптер қалам компьютер телефон',
      },
      {
        id: 'kk-beginner-15-05',
        title: { zh: '隐形单词练习 1', kk: 'Көрінбейтін сөздер жаттығуы 1', ru: 'Упражнение на невидимые слова 1', en: 'Invisible Words Exercise 1' },
        text: 'сәлем алайсың қалайсың рахмет кешіріңіз жарайды жақсы керемет әке ана аға әпке бауыр бала немере',
      },
      {
        id: 'kk-beginner-15-06',
        title: { zh: '隐形单词练习 2', kk: 'Көрінбейтін сөздер жаттығуы 2', ru: 'Упражнение на невидимые слова 2', en: 'Invisible Words Exercise 2' },
        text: 'қызыл көк сары жасыл қара ақ күміс алтын бір екі үш төрт бес алты жеті сегіз тоғыз он',
      },
      {
        id: 'kk-beginner-15-07',
        title: { zh: '文本练习 1', kk: 'Мәтін жаттығуы 1', ru: 'Упражнение на текст 1', en: 'Text Exercise 1' },
        text: 'Сенсорлық теру – бұл ақпаратты жылдам әрі дәл енгізудің тиімді әдісі. Егер сіз бастаушы болсаңыз, сенсорлық теруді үйрену үшін дұрыс әдістер мен сабақты жоспарлау маңызды.',
      },
      {
        id: 'kk-beginner-15-08',
        title: { zh: '文本练习 2', kk: 'Мәтін жаттығуы 2', ru: 'Упражнение на текст 2', en: 'Text Exercise 2' },
        text: 'Бірінші қадам – пернетақтаның негізгі орналасуын түсіну. Сенсорлық теруді үйренудің негізі – қолдың дұрыс орналасуы. Әдетте, саусақтарды «ф» және «ж» пернелерінде орналастыру ұсынылады.',
      },
      {
        id: 'kk-beginner-15-09',
        title: { zh: '附加按键练习', kk: 'Қосымша пернелер жаттығуы', ru: 'Дополнительное упражнение на клавиши', en: 'Additional Keys Exercise' },
        text: 'Back Tab Caps Enter Shift Ctrl Alt AltGr 0 1 2 3 4 5 6 7 8 9 - = [ ] \\ ; \' , . /',
      },
      {
        id: 'kk-beginner-15-10',
        title: { zh: '附加单词练习', kk: 'Қосымша сөздер жаттығуы', ru: 'Дополнительное упражнение на слова', en: 'Additional Words Exercise' },
        text: 'бару келу алу беру ішу жеу оқу жазу жүгіру секіру жүзу ұшу жүру көру есту мұғалім студент дәрігер инженер жұмысшы оқушы бала',
      },
      {
        id: 'kk-beginner-15-11',
        title: { zh: '完整键盘布局', kk: 'Толық пернетақта орналасуы', ru: 'Полная раскладка клавиатуры', en: 'Complete Keyboard Layout' },
        text: 'й ц у к е н г ш щ з х ъ / \\ Caps ф ы в а п р о л д ж э Enter Shift | \\ я ч с м и т ь б ю ? № Shift Ctrl Alt AltGr Ctrl ) ( ! " ә і ң ғ ; , : . ү ұ қ ө һ',
      },
      {
        id: 'kk-beginner-15-12',
        title: { zh: '综合练习', kk: 'Жалпы жаттығу', ru: 'Общее упражнение', en: 'Comprehensive Exercise' },
        text: 'Қазақстанда цифрлық технологиялардың дамуы жыл сайын жылдамдап келеді. Білім беру саласында онлайн оқыту жүйелері кеңінен қолданылады. Бұл студенттерге кез келген уақытта және жерде білім алуға мүмкіндік береді. Сенсорлық теру – бұл ақпаратты жылдам әрі дәл енгізудің тиімді әдісі.',
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
      {
        id: 'zh-advanced-01-02',
        title: '商务文章',
        text: '现代企业管理需要注重创新和效率。成功的公司往往能够快速适应市场变化，利用新技术提升竞争力。团队协作和沟通能力也是企业成功的关键因素。',
      },
      {
        id: 'zh-advanced-01-03',
        title: '文化文章',
        text: '中华文化源远流长，包含了丰富的哲学思想、文学艺术和传统习俗。从古代的诗词歌赋到现代的影视作品，中国文化在不断传承和创新中发展。',
      },
      {
        id: 'zh-advanced-01-04',
        title: '教育文章',
        text: '教育是个人成长和社会进步的重要基础。现代教育强调培养学生的创新思维和实践能力，而不仅仅是知识的传授。在线教育的发展为更多人提供了学习机会。',
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
      {
        id: 'ru-advanced-01-02',
        title: '商务文章',
        text: 'Эффективное управление бизнесом требует стратегического мышления и адаптивности. Компании должны постоянно искать инновационные решения для поддержания конкурентоспособности на рынке.',
      },
      {
        id: 'ru-advanced-01-03',
        title: '文化文章',
        text: 'Казахская культура богата традициями и современными ценностями. Национальная музыка, песни, танцы и традиционная одежда являются важной частью культурного наследия казахского народа.',
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
      {
        id: 'en-advanced-01-02',
        title: '商务文章',
        text: 'Effective business management requires strategic thinking and adaptability. Companies must constantly seek innovative solutions to maintain competitiveness in the market. Team collaboration and communication skills are also key factors for business success.',
      },
      {
        id: 'en-advanced-01-03',
        title: '文化文章',
        text: 'Kazakh culture is rich in traditions and modern values. National music, songs, dances, and traditional clothing are an important part of the cultural heritage of the Kazakh people. The culture continues to evolve while preserving its unique identity.',
      },
      {
        id: 'en-advanced-01-04',
        title: '教育文章',
        text: 'Education is a fundamental foundation for personal growth and social progress. Modern education emphasizes developing students innovative thinking and practical abilities, not just knowledge transmission. The development of online education provides learning opportunities for more people.',
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

