import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// 读取所有软件
const softwareDir = path.join(root, 'content/software');
const softwareFiles = fs.readdirSync(softwareDir).filter((f) => f.endsWith('.json'));
const allSoftware = softwareFiles
  .map((f) => {
    const content = fs.readFileSync(path.join(softwareDir, f), 'utf8');
    return JSON.parse(content);
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

// 读取所有教程
const tutorialsDir = path.join(root, 'content/tutorials');
const tutorialFiles = fs.readdirSync(tutorialsDir).filter((f) => f.endsWith('.mdx'));
const allTutorials = tutorialFiles.map((f) => {
  const raw = fs.readFileSync(path.join(tutorialsDir, f), 'utf8');
  const { data, content } = matter(raw);
  return {
    meta: data,
    content
  };
});

// 创建教程索引（仅元数据）
const tutorialsMeta = allTutorials
  .map((t) => t.meta)
  .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

// 读取所有 AI 项目
const aiDir = path.join(root, 'content/ai');
const aiFiles = fs.readdirSync(aiDir).filter((f) => f.endsWith('.json'));
const allAI = aiFiles
  .map((f) => {
    const content = fs.readFileSync(path.join(aiDir, f), 'utf8');
    return JSON.parse(content);
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// 生成内容数据
const contentData = {
  software: allSoftware,
  tutorials: allTutorials,
  tutorialsMeta,
  ai: allAI
};

// 写入 TypeScript 文件
const outputDir = path.join(root, 'lib/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成 TypeScript 文件
const tsContent = `// 此文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑

import type { Software, TutorialMeta, AIItem } from '../content';

export const allSoftware: Software[] = ${JSON.stringify(allSoftware, null, 2)};

export const allTutorials: Array<{ meta: TutorialMeta; content: string }> = ${JSON.stringify(allTutorials, null, 2)};

export const allTutorialsMeta: TutorialMeta[] = ${JSON.stringify(tutorialsMeta, null, 2)};

export const allAI: AIItem[] = ${JSON.stringify(allAI, null, 2)};
`;

fs.writeFileSync(
  path.join(outputDir, 'content.ts'),
  tsContent,
  'utf8'
);

console.log('✅ 内容数据已生成：');
console.log(`   - ${allSoftware.length} 个软件`);
console.log(`   - ${allTutorials.length} 个教程`);
console.log(`   - ${allAI.length} 个 AI 项目`);

