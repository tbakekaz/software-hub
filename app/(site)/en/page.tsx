import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export const metadata = {
  title: 'AI + Software Resource Hub for Central Asia',
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

export default function EnPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-12">
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">AI + Software Resource Hub for Central Asia</h1>
        <p className="text-lg text-muted-foreground">
          Curated tools, practical tutorials, and local-language support to make learning, creation, and monetization easier.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/software"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 border rounded-lg hover:opacity-90"
          >
            View Tutorials
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['AI Video Creation', 'AI Writing & Translation', 'Popular Software Downloads', 'Quick Start for Beginners'].map((item) => (
            <div key={item} className="border rounded-lg p-5 hover:border-primary transition-colors">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Weekly Picks</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['CapCut Template Pack', 'DeepL + ChatGPT Combo', 'Fast VPN'].map((item) => (
            <div key={item} className="border rounded-lg p-5">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Solutions</h2>
        <div className="space-y-4">
          {[
            'Short-form video: Topic→Script→Assets→Template→Publish',
            'Multilingual ops: Collect→Translate→Voiceover→Layout→Analyze',
            'AI writing: Prompt→Outline→Enrich→Review→Publish',
          ].map((item, idx) => (
            <div key={idx} className="border rounded-lg p-5">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Membership</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Basic</h3>
            <ul className="space-y-1 text-sm">
              <li>• Unlimited downloads</li>
              <li>• Update notifications</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Learn</h3>
            <ul className="space-y-1 text-sm">
              <li>• All downloads</li>
              <li>• Full tutorials</li>
              <li>• Template pack</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Pro</h3>
            <ul className="space-y-1 text-sm">
              <li>• 1-on-1 support</li>
              <li>• Monetization plan</li>
              <li>• Asset library</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Long-term maintenance?</h3>
            <p className="text-sm text-muted-foreground">Yes, we update weekly.</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Supported languages?</h3>
            <p className="text-sm text-muted-foreground">Chinese / Kazakh / Russian / English.</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Refund policy?</h3>
            <p className="text-sm text-muted-foreground">Requests accepted within 7 days.</p>
          </div>
        </div>
      </section>

      <section className="text-center border rounded-lg p-8 bg-muted/50">
        <h2 className="text-2xl font-semibold mb-4">Get full access to resources & tutorials</h2>
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Join Now
        </Link>
      </section>
    </main>
  );
}

