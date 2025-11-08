# Software Hub (Next.js 15)

## 本地运行

```bash
pnpm install
pnpm dev
```

## 环境变量

复制 `env.example` 为 `.env` 并填写：

- `NEXT_PUBLIC_GA_ID`：GA4 测量 ID，可留空
- `EXCHANGE_API_URL`：自定义汇率源（留空使用 exchangerate.host）
- `EXCHANGE_API_KEY`：占位

## 构建

```bash
pnpm build && pnpm start
```

## 部署

- 直接导入到 Vercel；仅当设置了 `NEXT_PUBLIC_GA_ID` 时启用 GA。

## 技术栈

Next.js 15、App Router、TypeScript、TailwindCSS、Shadcn UI（轻量自带组件）、MDX、ISR、GA4。

## 广告位配置（Banner）

- 配置文件：`config/ads.ts`
- 位置枚举：`global-header | home-below-hero | home-between-sections | sidebar | in-article | footer`
- 每个位置可设置：
  - `enabled` 是否启用
  - `variant` 渲染方式：`image | html | script | affiliate-card`
  - `dismissible` 是否可关闭（本地记忆 7 天）
  - `url/img/html/script` 素材字段

使用：页面中直接放置

```tsx
{/* @ts-expect-error Server/Client boundary */}
<MonetizeSlot position="home-below-hero" />
```

全部禁用：把 `config/ads.ts` 中相应位置的 `enabled` 设为 `false`；或在组件处移除插槽。

## 下载源配置

支持 **123云盘** 和 **Cloudflare R2** 作为下载源。

### 方式一：使用 sources 数组（推荐）

在 `content/software/*.json` 中配置：

```json
{
  "downloads": [
    {
      "platform": "windows",
      "sources": [
        { "type": "123pan", "url": "https://www.123pan.com/s/xxx-xxxxx" },
        { "type": "r2", "url": "https://your-r2-domain.com/file.exe" }
      ]
    }
  ]
}
```

### 方式二：使用 url 和 mirrorUrls（向后兼容）

```json
{
  "downloads": [
    {
      "platform": "windows",
      "url": "https://www.123pan.com/s/xxx-xxxxx",
      "mirrorUrls": ["https://your-r2-domain.com/file.exe"]
    }
  ]
}
```

**说明：**
- `url` 字段会被识别为 123云盘链接
- `mirrorUrls` 会被识别为 Cloudflare R2 链接（Pro 会员可见）
- `sources` 数组格式更灵活，支持自定义标签

### 获取下载链接

1. **123云盘**：
   - 上传文件到 123云盘
   - 获取分享链接（格式：`https://www.123pan.com/s/xxx-xxxxx`）
   - 直接使用分享链接即可

2. **Cloudflare R2**：
   - 在 Cloudflare 控制台创建 R2 存储桶
   - 上传文件并设置公开访问
   - 获取公开 URL（格式：`https://your-domain.com/path/to/file`）
   - 或使用自定义域名

## 多版本支持

支持为软件添加多个版本的下载链接（如不同年份的版本）。

### 使用方法

在 `downloads` 数组中为每个下载项添加 `version` 字段：

```json
{
  "downloads": [
    {
      "version": "2024",
      "platform": "windows",
      "sources": [
        { "type": "123pan", "url": "..." },
        { "type": "r2", "url": "..." }
      ]
    },
    {
      "version": "2024",
      "platform": "macos",
      "sources": [...]
    },
    {
      "version": "2023",
      "platform": "windows",
      "sources": [...]
    }
  ]
}
```

**说明：**
- `version` 字段是可选的，如果不指定，会使用软件顶层的 `version` 字段
- 版本会按版本号降序排列（最新版本在前）
- 最新版本（与顶层 `version` 相同）会显示"最新"标签
- 每个版本可以折叠/展开，默认展开最新版本
- 版本号可以是年份（如 "2024"）或其他格式（如 "1.2.3"）

