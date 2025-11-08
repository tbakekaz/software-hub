# 部署指南

本项目支持两种部署方式：**Vercel**（推荐）和 **Cloudflare Pages**。

## 方式一：Vercel 部署（推荐）

### 1. 准备工作

1. **初始化 Git 仓库**（如果还没有）：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub/GitLab/Bitbucket**：
   ```bash
   # 在 GitHub 创建新仓库后
   git remote add origin https://github.com/your-username/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### 2. 在 Vercel 部署

1. **访问 Vercel**：
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**：
   - 点击 **"Add New..."** → **"Project"**
   - 选择你的 Git 仓库
   - 点击 **"Import"**

3. **配置项目**：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（留空）
   - **Build Command**: `pnpm build`（或 `npm run build`）
   - **Output Directory**: `.next`（自动）
   - **Install Command**: `pnpm install`（或 `npm install`）

4. **环境变量**（可选）：
   - 点击 **"Environment Variables"**
   - 添加：
     - `NEXT_PUBLIC_GA_ID`（如果需要 Google Analytics）
     - `EXCHANGE_API_URL`（如果需要自定义汇率 API）
     - `EXCHANGE_API_KEY`（如果需要）

5. **部署**：
   - 点击 **"Deploy"**
   - 等待构建完成（约 2-5 分钟）

### 3. 绑定自定义域名

1. **在 Vercel 添加域名**：
   - 进入项目 → **"Settings"** → **"Domains"**
   - 输入你的域名（如 `example.com`）
   - 点击 **"Add"**

2. **配置 DNS**：
   - Vercel 会显示需要添加的 DNS 记录
   - 在你的域名 DNS 设置中添加：
     - **类型**: `A` 或 `CNAME`
     - **名称**: `@` 或 `www`
     - **值**: Vercel 提供的 IP 或域名
   - 等待 DNS 生效（通常几分钟到几小时）

3. **SSL 证书**：
   - Vercel 会自动为你的域名配置 SSL 证书
   - 无需手动配置

## 方式二：Cloudflare Pages 部署

### 1. 准备工作

1. **初始化 Git 仓库**（如果还没有）：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub/GitLab/Bitbucket**：
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### 2. 在 Cloudflare Pages 部署

1. **访问 Cloudflare Dashboard**：
   - 打开 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录你的账号

2. **创建 Pages 项目**：
   - 左侧菜单选择 **"Workers & Pages"**
   - 点击 **"Create application"**
   - 选择 **"Pages"** → **"Connect to Git"**

3. **连接 Git 仓库**：
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 授权 Cloudflare 访问
   - 选择仓库
   - 点击 **"Begin setup"**

4. **配置构建设置**：
   - **Project name**: `software-hub`（可自定义）
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`
   - **Build command**:
     ```bash
     pnpm install && pnpm build && pnpm pages:build
     ```
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/`（留空）

5. **环境变量**（可选）：
   - 点击 **"Add variable"**
   - 添加：
     - `NEXT_PUBLIC_GA_ID`
     - `EXCHANGE_API_URL`
     - `EXCHANGE_API_KEY`
     - `NODE_VERSION`: `18`

6. **高级设置**：
   - **Node.js version**: `18` 或 `20`
   - **Package manager**: `pnpm`

7. **部署**：
   - 点击 **"Save and Deploy"**
   - 等待构建完成（约 5-10 分钟）

### 3. 绑定自定义域名

1. **在 Cloudflare Pages 添加域名**：
   - 进入项目 → **"Custom domains"** 标签
   - 点击 **"Set up a custom domain"**
   - 输入你的域名（如 `example.com`）

2. **配置 DNS**：
   - 如果域名在 Cloudflare 管理：
     - Cloudflare 会自动配置 DNS
   - 如果域名不在 Cloudflare 管理：
     - 在你的域名 DNS 设置中添加：
       - **类型**: `CNAME`
       - **名称**: `@` 或 `www`
       - **目标**: `your-project.pages.dev`（Cloudflare 会提供具体值）

3. **SSL 证书**：
   - Cloudflare 会自动为你的域名配置 SSL 证书
   - 无需手动配置

## 部署后检查

1. **测试网站功能**：
   - 访问部署后的 URL
   - 测试页面加载
   - 测试软件下载功能
   - 测试多语言切换

2. **检查环境变量**：
   - 确保所有必要的环境变量都已设置
   - 检查 Google Analytics（如果使用）

3. **性能优化**：
   - 检查页面加载速度
   - 检查图片加载
   - 检查 API 响应时间

## 常见问题

### 构建失败

- 检查 Node.js 版本（需要 18+）
- 检查依赖是否完整安装
- 查看构建日志中的错误信息

### 域名无法访问

- 检查 DNS 配置是否正确
- 等待 DNS 生效（可能需要几小时）
- 检查 SSL 证书是否已配置

### 环境变量不生效

- 确保变量名正确（`NEXT_PUBLIC_` 开头用于客户端变量）
- 重新部署项目
- 清除浏览器缓存

## 推荐部署方式

- **Vercel**：适合快速部署，自动优化，免费 SSL
- **Cloudflare Pages**：适合需要 Cloudflare CDN 的场景

建议使用 **Vercel**，因为它对 Next.js 的支持最好，部署速度最快。

