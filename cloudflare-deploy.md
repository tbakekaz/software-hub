# Cloudflare Pages 部署指南

## 前置步骤

### 1. 安装依赖

在项目根目录运行：

```bash
pnpm add -D @cloudflare/next-on-pages wrangler
```

或者使用 npm：

```bash
npm install -D @cloudflare/next-on-pages wrangler
```

## Cloudflare Dashboard 配置

### 1. 登录 Cloudflare

访问 [dash.cloudflare.com](https://dash.cloudflare.com) 并登录

### 2. 创建 Pages 项目

1. 左侧菜单选择 **"Workers & Pages"**
2. 点击 **"Create application"**
3. 选择 **"Pages"** → **"Connect to Git"**

### 3. 连接 Git 仓库

1. 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
2. 授权 Cloudflare 访问
3. 选择仓库：`my-project`（或你的仓库名）
4. 点击 **"Begin setup"**

### 4. 配置构建设置

在 **"Configure your project"** 页面填写：

- **Project name**: `software-hub`（可自定义）
- **Production branch**: `main` 或 `master`
- **Framework preset**: `Next.js`（如果可选）
- **Build command**:
  ```bash
  pnpm install && pnpm build && pnpm pages:build
  ```
  或使用 npm：
  ```bash
  npm install && npm run build && npm run pages:build
  ```
- **Build output directory**:
  ```
  .vercel/output/static
  ```
- **Root directory**: `/`（留空）
- **Environment variables**: 点击 **"Add variable"** 添加：
  - `NEXT_PUBLIC_GA_ID`（如果需要）
  - `EXCHANGE_API_URL`（如果需要）
  - `EXCHANGE_API_KEY`（如果需要）
  - `NODE_VERSION`: `18`（确保使用 Node 18+）

### 5. 高级设置

点击 **"Show advanced settings"**：

- **Node.js version**: `18` 或 `20`
- **Package manager**: `pnpm`（或 `npm`）
- **Install command**: `pnpm install`（或 `npm install`）

### 6. 保存并部署

1. 点击 **"Save and Deploy"**
2. 等待构建完成（约 5-10 分钟）

## 部署后

### 查看部署状态

- 在 Cloudflare Dashboard 的 **"Deployments"** 标签页查看部署状态
- 部署完成后会生成预览 URL：`https://your-project.pages.dev`

### 自动部署

- 每次推送到 `main` 分支会自动触发部署
- 每个 Pull Request 会创建预览部署

## 自定义域名

### 1. 添加自定义域名

1. 在 Pages 项目页面，进入 **"Custom domains"** 标签
2. 点击 **"Set up a custom domain"**
3. 输入你的域名（如 `example.com`）
4. 按照提示配置 DNS

### 2. DNS 配置

在域名 DNS 设置中添加：

- **类型**: `CNAME`
- **名称**: `@` 或 `www`
- **目标**: `your-project.pages.dev`（Cloudflare 会提供具体值）

## 环境变量管理

### 在 Dashboard 设置

1. 进入 Pages 项目
2. 进入 **"Settings"** → **"Environment variables"**
3. 为 **Production**、**Preview**、**Branch** 分别添加变量

### 常用环境变量

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
EXCHANGE_API_URL=https://api.example.com
EXCHANGE_API_KEY=your-api-key
NODE_ENV=production
```

## 本地测试（可选）

在部署前可以本地测试：

```bash
# 1. 构建项目
pnpm build

# 2. 使用 Cloudflare 适配器构建
pnpm pages:build

# 3. 本地预览（需要安装 wrangler）
pnpm wrangler pages dev .vercel/output/static
```

## 常见问题

### 构建失败 - "Cannot find module"

**解决方案**: 确保 `package.json` 中所有依赖都已安装，检查 `pnpm install` 是否成功。

### 构建失败 - "Dynamic routes not supported"

**解决方案**: 项目使用了 `force-dynamic`，确保使用 `@cloudflare/next-on-pages` 适配器。

### 图片不显示

**解决方案**: 已在 `next.config.mjs` 中设置 `images.unoptimized: true`。

### 环境变量不生效

**解决方案**:
- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
- 在 Cloudflare Dashboard 中重新设置环境变量
- 重新部署项目

### Node 版本不匹配

**解决方案**: 在构建设置中明确指定 `NODE_VERSION=18` 或 `20`。

## 检查清单

- [ ] 已安装 `@cloudflare/next-on-pages` 和 `wrangler`
- [ ] 代码已推送到 Git 仓库
- [ ] 在 Cloudflare 创建 Pages 项目
- [ ] 配置构建命令和输出目录
- [ ] 设置环境变量
- [ ] 首次部署成功
- [ ] 测试网站功能
- [ ] 配置自定义域名（可选）


