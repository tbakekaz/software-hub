import Link from 'next/link';

export const metadata = {
  title: 'Орталық Азияға арналған AI + софт ресурс орталығы',
  alternates: {
    languages: {
      'x-default': '/',
      'zh-KZ': '/zh',
      'kk-KZ': '/kk',
      'ru-RU': '/ru',
      'en': '/en',
    },
  },
};

export default function KkPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-12">

      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Орталық Азияға арналған AI + софт ресурс орталығы</h1>
        <p className="text-lg text-muted-foreground">
          Таңдалған құралдар, пайдалы сабақтар және жергілікті қолдау — оқу, шығармашылық және монетизацияны жеңілдетеді.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/software"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Қолдануды бастау
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 border rounded-lg hover:opacity-90"
          >
            Сабақтарды көру
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Жылдам кіру</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['AI бейне жасау', 'AI жазу және аударма', 'Танымал бағдарламалар', 'Жаңадан бастаушылар'].map((item) => (
            <div key={item} className="border rounded-lg p-5 hover:border-primary transition-colors">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Апталық таңдаулар</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['CapCut үлгілері', 'DeepL + ChatGPT', 'Жылдам VPN'].map((item) => (
            <div key={item} className="border rounded-lg p-5">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Шешімдер</h2>
        <div className="space-y-4">
          {[
            'Қысқа видео: тақырып→сценарий→материал→үлгі→жариялау',
            'Көптілді аккаунт: жинау→аудару→дыбыстау→беттеу→талдау',
            'AI жазба: промпт→құрылым→толықтыру→тексеру→жариялау',
          ].map((item, idx) => (
            <div key={idx} className="border rounded-lg p-5">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Мүшелік</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Негізгі</h3>
            <ul className="space-y-1 text-sm">
              <li>• Жылдам жүктеу</li>
              <li>• Жаңарту хабарламалары</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Оқу</h3>
            <ul className="space-y-1 text-sm">
              <li>• Толық жүктеу</li>
              <li>• Барлық сабақтар</li>
              <li>• Үлгілер</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Бизнес</h3>
            <ul className="space-y-1 text-sm">
              <li>• 1v1 кеңес</li>
              <li>• Монетизация жоспары</li>
              <li>• Медиа қоры</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Жиі қойылатын сұрақтар</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Ұзақ мерзім қолдайсыз ба?</h3>
            <p className="text-sm text-muted-foreground">Иә, апта сайын жаңартамыз.</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Қандай тілдер?</h3>
            <p className="text-sm text-muted-foreground">Қытайша / Қазақша / Орысша / Ағылшынша.</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Қайтару бар ма?</h3>
            <p className="text-sm text-muted-foreground">7 күн ішінде өтініш беруге болады.</p>
          </div>
        </div>
      </section>

      <section className="text-center border rounded-lg p-8 bg-muted/50">
        <h2 className="text-2xl font-semibold mb-4">Толық ресурс пен сабақтарға қол жеткіз</h2>
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Қазір қосылу
        </Link>
      </section>
    </main>
  );
}

