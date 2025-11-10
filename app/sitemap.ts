import type { MetadataRoute } from 'next';
import { getAllSoftware, getAllTutorials, getAllAI } from '@/lib/content-edge';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const base = siteConfig.url;
    const now = new Date();

    const [software, tutorials, aiItems] = await Promise.all([
      getAllSoftware(),
      Promise.resolve(getAllTutorials()),
      Promise.resolve(getAllAI()),
    ]);

    const routes: MetadataRoute.Sitemap = [
      { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
      { url: `${base}/zh`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/kk`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/ru`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/en`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/software`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/tutorials`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${base}/ai`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
      { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${base}/sponsor`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];

    const softwareEntries = software.map((s) => ({
      url: `${base}/software/${s.slug}`,
      lastModified: new Date(s.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const tutorialEntries = tutorials.map((t) => ({
      url: `${base}/tutorials/${t.slug}`,
      lastModified: new Date(t.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    const aiEntries = aiItems.map((ai) => ({
      url: `${base}/ai/discover#${ai.name.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...routes, ...softwareEntries, ...tutorialEntries, ...aiEntries];
  } catch (error) {
    const base = siteConfig.url;
    const now = new Date();
    return [
      { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
      { url: `${base}/zh`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/kk`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/ru`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/en`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/software`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${base}/tutorials`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${base}/ai`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    ];
  }
}




