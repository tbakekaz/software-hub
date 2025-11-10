import { getAllEnglish } from '@/lib/content-edge';
import { getDictionary } from '@/lib/i18n/server';
import { EnglishResourceCard } from '@/components/EnglishResourceCard';
import type { EnglishResource } from '@/lib/content-edge';

export default async function EnglishPage() {
  const { dict, lang } = await getDictionary();
  const resources = getAllEnglish();
  
  // 按分类分组
  const byCategory = resources.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EnglishResource[]>);

  const categoryLabels: Record<string, string> = {
    grammar: '语法',
    vocabulary: '词汇',
    listening: '听力',
    speaking: '口语',
    reading: '阅读',
    writing: '写作',
    course: '课程',
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">英语学习资源</h1>
        <p className="text-muted-foreground">精选视频、文档、音频学习材料</p>
      </header>

      {Object.keys(byCategory).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无英语学习资源</p>
          <p className="text-sm mt-2">请在 content/english/ 目录添加 JSON 文件</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([category, items]) => (
          <section key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{categoryLabels[category] || category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <EnglishResourceCard key={item.slug} resource={item} lang={lang} />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}

