import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export const metadata = {
  title: '中亚 AI 与软件资源中心｜下载、教程与变现（中文）',
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

export default function ZhPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-12">
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">中亚用户必备的 AI + 软件资源中心</h1>
        <p className="text-lg text-muted-foreground">
          精选工具、实用教程与本地化支持，让学习、创作与变现更轻松。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/software"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            开始使用
          </Link>
          <Link
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 border rounded-lg hover:opacity-90"
          >
            查看教程
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">快速入口</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['AI 视频创作', 'AI 写作与翻译', '常用软件下载', '新手快速入门'].map((item) => (
            <div key={item} className="border rounded-lg p-5 hover:border-primary transition-colors">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">本周推荐</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['CapCut 模板包', 'DeepL + ChatGPT 组合', '高速 VPN'].map((item) => (
            <div key={item} className="border rounded-lg p-5">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">解决方案</h2>
        <div className="space-y-4">
          {[
            '新手做短视频：选题→脚本→素材→模板→发布',
            '跨语种账号：采编→翻译→配音→排版→数据复盘',
            'AI 辅助写作：提示词→结构→细化→检查→发布',
          ].map((item, idx) => (
            <div key={idx} className="border rounded-lg p-5">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">会员权益</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">基础</h3>
            <ul className="space-y-1 text-sm">
              <li>• 不限速下载</li>
              <li>• 资源更新通知</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">学习</h3>
            <ul className="space-y-1 text-sm">
              <li>• 全部下载</li>
              <li>• 全套教程</li>
              <li>• 模板包</li>
            </ul>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">创业</h3>
            <ul className="space-y-1 text-sm">
              <li>• 1v1 答疑</li>
              <li>• 变现方案</li>
              <li>• 素材库</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">常见问题</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">是否长期维护？</h3>
            <p className="text-sm text-muted-foreground">是，我们每周更新。</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">支持哪些语言？</h3>
            <p className="text-sm text-muted-foreground">中文 / 哈萨克语 / 俄语 / 英语。</p>
          </div>
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">如何退款？</h3>
            <p className="text-sm text-muted-foreground">7 天内不满意可申请。</p>
          </div>
        </div>
      </section>

      <section className="text-center border rounded-lg p-8 bg-muted/50">
        <h2 className="text-2xl font-semibold mb-4">获取完整资源与教程</h2>
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          立即加入
        </Link>
      </section>
    </main>
  );
}

