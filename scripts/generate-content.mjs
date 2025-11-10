import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const OUTPUT_ROOT = path.join(root, 'lib/generated');
const SOFTWARE_SOURCE = path.join(root, 'content/software');
const TUTORIALS_SOURCE = path.join(root, 'content/tutorials');
const AI_SOURCE = path.join(root, 'content/ai');
const LANGUAGES_SOURCE = path.join(root, 'content/languages');
const SOFTWARE_PAGE_SIZE = 12;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function chunk(list, size) {
  const pages = [];
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size));
  }
  return pages;
}

function formatPage(data) {
  return `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑\nconst data = ${JSON.stringify(data)} as const;\nexport default data;\n`;
}

if (fs.existsSync(OUTPUT_ROOT)) {
  fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
}
ensureDir(OUTPUT_ROOT);

const allSoftware = fs
  .readdirSync(SOFTWARE_SOURCE)
  .filter((f) => f.endsWith('.json'))
  .map((file) => JSON.parse(fs.readFileSync(path.join(SOFTWARE_SOURCE, file), 'utf8')))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const allTutorials = fs
  .readdirSync(TUTORIALS_SOURCE)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const raw = fs.readFileSync(path.join(TUTORIALS_SOURCE, file), 'utf8');
    const { data, content } = matter(raw);
    return { meta: data, content };
  });

const tutorialsMeta = allTutorials
  .map((t) => t.meta)
  .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

const allAI = fs
  .readdirSync(AI_SOURCE)
  .filter((f) => f.endsWith('.json'))
  .map((file) => JSON.parse(fs.readFileSync(path.join(AI_SOURCE, file), 'utf8')))
  .sort((a, b) => a.name.localeCompare(b.name));

// 软件分页
const softwareGeneratedDir = path.join(OUTPUT_ROOT, 'software');
ensureDir(softwareGeneratedDir);
const softwarePages = chunk(allSoftware, SOFTWARE_PAGE_SIZE);
softwarePages.forEach((page, index) => {
  writeFile(path.join(softwareGeneratedDir, `page-${index}.ts`), formatPage(page));
});

const softwareManifest = {
  total: allSoftware.length,
  pageSize: SOFTWARE_PAGE_SIZE,
  pageCount: softwarePages.length,
  slugs: allSoftware.map((item) => item.slug),
  categories: Array.from(new Set(allSoftware.map((item) => item.category))).sort(),
};

const loaderSource = `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑
export const softwareManifest = ${JSON.stringify(softwareManifest)} as const;

type PageLoader = () => Promise<typeof import('./page-0').default>;
type PageData = Awaited<ReturnType<PageLoader>>;

const loaders: PageLoader[] = [
${softwarePages
  .map((_, index) => `  () => import('./page-${index}').then((mod) => mod.default) as Promise<typeof import('./page-${index}').default>`,)
  .join(',\n')}
];

let cachedPages: PageData[] | null = null;
let cachedAll: PageData[number][] | null = null;
let firstPageCache: PageData | null = null;

export async function loadSoftwarePage(index: number) {
  const loader = loaders[index];
  if (!loader) {
    throw new Error('Software page index ' + index + ' out of range');
  }
  return loader();
}

export async function loadFirstSoftwarePage() {
  if (firstPageCache) return firstPageCache;
  const firstLoader = loaders[0];
  if (!firstLoader) return [];
  firstPageCache = await firstLoader();
  return firstPageCache;
}

export async function loadAllSoftware() {
  if (cachedAll) return cachedAll;
  const pages = cachedPages || (await Promise.all(loaders.map((loader) => loader())));
  cachedPages = pages;
  cachedAll = pages.flat();
  return cachedAll;
}
`;
writeFile(path.join(softwareGeneratedDir, 'loader.ts'), loaderSource);

// 教程与 AI 数据
writeFile(
  path.join(OUTPUT_ROOT, 'tutorials.ts'),
  `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑\nexport const allTutorials = ${JSON.stringify(allTutorials)} as const;\nexport const allTutorialsMeta = ${JSON.stringify(tutorialsMeta)} as const;\n`
);

writeFile(
  path.join(OUTPUT_ROOT, 'ai.ts'),
  `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑\nexport const allAI = ${JSON.stringify(allAI)} as const;\n`
);

// 语言学习资源
let allLanguageResources = [];
if (fs.existsSync(LANGUAGES_SOURCE)) {
  allLanguageResources = fs
    .readdirSync(LANGUAGES_SOURCE)
    .filter((f) => f.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(LANGUAGES_SOURCE, file), 'utf8')))
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  
  writeFile(
    path.join(OUTPUT_ROOT, 'languages.ts'),
    `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑\nexport const allLanguageResources = ${JSON.stringify(allLanguageResources)} as const;\n`
  );
} else {
  // 如果目录不存在，创建空数组
  writeFile(
    path.join(OUTPUT_ROOT, 'languages.ts'),
    `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑\nexport const allLanguageResources = [] as const;\n`
  );
}

console.log('✅ 内容数据已生成：');
console.log(`   - ${allSoftware.length} 个软件，分页 ${softwarePages.length} 页，每页 ${SOFTWARE_PAGE_SIZE} 条`);
console.log(`   - ${allTutorials.length} 个教程`);
console.log(`   - ${allAI.length} 个 AI 项目`);
console.log(`   - ${allLanguageResources.length} 个语言学习资源`);
