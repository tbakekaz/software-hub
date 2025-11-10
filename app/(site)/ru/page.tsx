import Link from 'next/link';

export const metadata = {
  title: 'Центр ресурсов по ИИ и софту для Центральной Азии',
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

export default function RuPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Центр ресурсов по ИИ и софту для Центральной Азии</h1>
        <p className="text-lg text-muted-foreground">
          Отобранные инструменты, полезные уроки и локальная поддержка — учиться, создавать и монетизировать станет проще.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/software"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Начать
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 border rounded-lg hover:opacity-90"
          >
            Смотреть уроки
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Быстрый вход</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Создание видео на ИИ', 'Письмо и перевод на ИИ', 'Загрузка программ', 'Быстрый старт'].map((item) => (
            <div key={item} className="border rounded-lg p-5 hover:border-primary transition-colors">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Рекомендации недели</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['Пакет шаблонов CapCut', 'Связка DeepL + ChatGPT', 'Быстрый VPN'].map((item) => (
            <div key={item} className="border rounded-lg p-5">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Решения</h2>
        <div className="space-y-4">
          {[
            'Короткое видео: тема→скрипт→материалы→шаблон→публикация',
            'Мультиязычный аккаунт: сбор→перевод→озвучка→верстка→анализ',
            'Письмо с ИИ: промпт→структура→детализация→проверка→публикация',
          ].map((item, idx) => (
            <div key={idx} className="border rounded-lg p-5">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Тарифы</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Базовый</h3>
            <ul className="space-y-1 text-sm">
              <li>• Безлимитная загрузка</li>
              <li>• Уведомления об обновлениях</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Обучение</h3>
            <ul className="space-y-1 text-sm">
              <li>• Все загрузки</li>
              <li>• Полный курс</li>
              <li>• Пакет шаблонов</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Бизнес</h3>
            <ul className="space-y-1 text-sm">
              <li>• 1v1 консультация</li>
              <li>• План монетизации</li>
              <li>• Медиатека</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Часто задаваемые вопросы</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Поддержка долгосрочная?</h3>
            <p className="text-sm text-muted-foreground">Да, обновляем еженедельно.</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Какие языки?</h3>
            <p className="text-sm text-muted-foreground">Китайский / Казахский / Русский / Английский.</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Как вернуть оплату?</h3>
            <p className="text-sm text-muted-foreground">В течение 7 дней можно подать запрос.</p>
          </div>
        </div>
      </section>

      <section className="text-center border rounded-lg p-8 bg-muted/50">
        <h2 className="text-2xl font-semibold mb-4">Получите полный доступ к ресурсам и урокам</h2>
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Присоединиться
        </Link>
      </section>
    </main>
  );
}

