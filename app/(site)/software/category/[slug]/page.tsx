import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/server';
import { getSoftwareByCategory, getAllSoftware } from '@/lib/content-edge';
import { CategoryHub } from '@/components/CategoryHub';
import { siteConfig } from '@/config/site';
import { pickLocaleString } from '@/lib/i18n/translate';

export const revalidate = 3600;
// 移除 edge runtime 以启用静态生成（已有 generateStaticParams）
// export const runtime = 'edge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_CONFIG: Record<
  string,
  {
    description: string;
    faqs?: Array<{ question: string; answer: string }>;
    comparison?: Array<{ name: string; pros: string[]; cons: string[] }>;
    useCases?: Array<{ title: string; description: string; recommended: string[] }>;
  }
> = {
  download: {
    description: '精选下载与加速工具，支持多线程、断点续传、镜像加速等功能，提升下载效率。',
    faqs: [
      {
        question: '如何选择下载工具？',
        answer: '根据您的需求：需要多线程下载选择支持多线程的工具；需要断点续传选择支持断点续传的工具；需要加速选择支持镜像加速的工具。',
      },
      {
        question: '下载速度慢怎么办？',
        answer: '可以尝试更换下载源、使用镜像加速、或选择支持多线程下载的工具。',
      },
    ],
    comparison: [
      {
        name: 'IDM',
        pros: ['多线程下载', '断点续传', '浏览器集成'],
        cons: ['付费软件', '仅 Windows'],
      },
      {
        name: 'Free Download Manager',
        pros: ['免费开源', '跨平台', '支持 BT'],
        cons: ['界面较旧', '功能相对简单'],
      },
    ],
    useCases: [
      {
        title: '大文件下载',
        description: '需要下载大型安装包、视频文件时，选择支持多线程和断点续传的工具。',
        recommended: ['IDM', 'Free Download Manager'],
      },
      {
        title: '批量下载',
        description: '需要批量下载多个文件时，选择支持批量任务管理的工具。',
        recommended: ['Free Download Manager'],
      },
    ],
  },
  video: {
    description: '专业视频编辑与剪辑工具，支持多格式、特效、字幕等功能，满足从入门到专业的需求。',
    faqs: [
      {
        question: '新手应该选择哪个视频编辑软件？',
        answer: '建议从简单易用的工具开始，如剪映、DaVinci Resolve（免费版），逐步学习后再使用专业工具。',
      },
      {
        question: '视频编辑需要什么配置？',
        answer: '基本编辑需要 8GB 内存和独立显卡；专业编辑建议 16GB+ 内存和高端显卡。',
      },
    ],
    comparison: [
      {
        name: 'Adobe Premiere Pro',
        pros: ['专业功能', '丰富插件', '行业标准'],
        cons: ['学习曲线陡', '订阅制', '资源占用大'],
      },
      {
        name: 'DaVinci Resolve',
        pros: ['免费版功能强大', '专业调色', '跨平台'],
        cons: ['学习曲线陡', '对硬件要求高'],
      },
    ],
    useCases: [
      {
        title: '短视频制作',
        description: '制作短视频、Vlog 时，选择操作简单、模板丰富的工具。',
        recommended: ['剪映', 'DaVinci Resolve'],
      },
      {
        title: '专业视频编辑',
        description: '进行专业视频编辑、调色时，选择功能强大的专业工具。',
        recommended: ['Adobe Premiere Pro', 'DaVinci Resolve'],
      },
    ],
  },
};

export async function generateStaticParams() {
  try {
    const all = await getAllSoftware();
    const categories = new Set<string>();
    all.forEach((item) => {
      if (item.category) categories.add(item.category.toLowerCase());
    });
    return Array.from(categories).map((cat) => ({ slug: cat }));
  } catch (e) {
    console.warn('[CategoryPage] generateStaticParams fallback', e);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const config = CATEGORY_CONFIG[slug];
  const description = config?.description || `${categoryName} 类别软件导航与选型指南`;

  return {
    title: `${categoryName} - ${siteConfig.name}`,
    description,
    openGraph: {
      title: `${categoryName} - ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/software/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const { dict, lang } = await getDictionary();
  const software = await getSoftwareByCategory(slug);
  const config = CATEGORY_CONFIG[slug];

  if (!config) {
    return notFound();
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="container mx-auto px-4 py-10">
      <CategoryHub
        category={categoryName}
        categoryDescription={config.description}
        software={software}
        lang={lang}
        dict={dict}
        faqs={config.faqs}
        comparison={config.comparison}
        useCases={config.useCases}
      />
    </main>
  );
}

