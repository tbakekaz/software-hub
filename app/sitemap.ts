import type { MetadataRoute } from 'next';
import { getAllSoftware, getAllTutorials } from '@/lib/content-edge';

export const runtime = 'edge';

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    const base = 'https://kazsoft.dpdns.org';
    const routes: MetadataRoute.Sitemap = [
      '', '/software', '/tutorials', '/ai', '/about', '/sponsor', '/privacy', '/terms'
    ].map((p) => ({ url: base + p, lastModified: new Date() }));
    const software = getAllSoftware().map((s) => ({ url: `${base}/software/${s.slug}`, lastModified: new Date(s.updatedAt) }));
    const tutorials = getAllTutorials().map((t) => ({ url: `${base}/tutorials/${t.slug}`, lastModified: new Date(t.date) }));
    return [...routes, ...software, ...tutorials];
  } catch (error) {
    // 如果出错，返回基础路由
    const base = 'https://kazsoft.dpdns.org';
    return [
      '', '/software', '/tutorials', '/ai', '/about', '/sponsor', '/privacy', '/terms'
    ].map((p) => ({ url: base + p, lastModified: new Date() }));
  }
}




