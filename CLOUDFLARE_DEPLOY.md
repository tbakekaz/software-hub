# Cloudflare Pages 部署详细步骤

## 第一步：准备 Git 仓库

### 1. 创建 GitHub 仓库（如果还没有）

1. 访问 [github.com](https://github.com) 并登录
2. 点击右上角 **"+"** → **"New repository"**
3. 填写信息：
   - **Repository name**: `software-hub`（或你喜欢的名称）
   - **Description**: Software Hub - Next.js 15
   - **Visibility**: Public 或 Private（根据你的需求）
   - **不要**勾选 "Initialize this repository with a README"（因为已有文件）
4. 点击 **"Create repository"**

### 2. 推送代码到 GitHub

在项目目录执行：

```bash
# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/software-hub.git

# 提交所有更改
git add .
git commit -m "准备部署：完成所有功能开发"

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 第二步：在 Cloudflare Pages 创建项目

### 1. 登录 Cloudflare Dashboard

1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 使用你的 Cloudflare 账号登录

### 2. 创建 Pages 项目

1. 在左侧菜单选择 **"Workers & Pages"**
2. 点击 **"Create application"**
3. 选择 **"Pages"** 标签
4. 点击 **"Connect to Git"**

### 3. 连接 Git 仓库

1. 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
2. 如果首次使用，需要授权 Cloudflare 访问你的 Git 账号
3. 选择仓库：`software-hub`（或你的仓库名）
4. 点击 **"Begin setup"**

## 第三步：配置构建设置

### 基本设置

在 **"Configure your project"** 页面填写：

- **Project name**: `software-hub`（可自定义）
- **Production branch**: `main`（或 `master`，根据你的默认分支）

### 构建设置（重要！）

- **Framework preset**: 选择 **"Next.js"**（如果可选）

- **Build command**:
  ```bash
  pnpm install && pnpm build && pnpm pages:build
  ```
  
  如果使用 npm：
  ```bash
  npm install && npm run build && npm run pages:build
  ```

- **Build output directory**:
  ```
  .vercel/output/static
  ```

- **Root directory**: `/`（留空，使用根目录）

### 环境变量（可选）

点击 **"Add variable"** 添加：

- `NEXT_PUBLIC_GA_ID` = `你的GA ID`（如果需要 Google Analytics）
- `EXCHANGE_API_URL` = `你的汇率API地址`（如果需要）
- `EXCHANGE_API_KEY` = `你的API密钥`（如果需要）
- `NODE_VERSION` = `18`（确保使用 Node 18+）

### 高级设置

点击 **"Show advanced settings"**：

- **Node.js version**: `18` 或 `20`
- **Package manager**: `pnpm`（或 `npm`，根据你使用的）
- **Install command**: `pnpm install`（或 `npm install`）

## 第四步：部署

1. 检查所有设置是否正确
2. 点击 **"Save and Deploy"**
3. 等待构建完成（约 5-10 分钟）

### 查看部署状态

- 在 **"Deployments"** 标签页查看构建日志
- 部署成功后会显示预览 URL：`https://software-hub.pages.dev`（或类似）

## 第五步：绑定自定义域名

### 1. 添加自定义域名

1. 在 Pages 项目页面，点击 **"Custom domains"** 标签
2. 点击 **"Set up a custom domain"**
3. 输入你的域名（如 `example.com` 或 `www.example.com`）
4. 点击 **"Continue"**

### 2. 配置 DNS

Cloudflare 会显示需要添加的 DNS 记录：

#### 如果域名在 Cloudflare 管理：

- Cloudflare 会自动配置 DNS 记录
- 只需等待几分钟让 DNS 生效

#### 如果域名不在 Cloudflare 管理：

在你的域名 DNS 提供商处添加：

**对于根域名（example.com）**：
- **类型**: `CNAME`
- **名称**: `@`
- **目标**: `software-hub.pages.dev`（Cloudflare 会提供具体值）
- **TTL**: `自动` 或 `3600`

**对于 www 子域名（www.example.com）**：
- **类型**: `CNAME`
- **名称**: `www`
- **目标**: `software-hub.pages.dev`（Cloudflare 会提供具体值）
- **TTL**: `自动` 或 `3600`

### 3. 等待 DNS 生效

- DNS 记录生效通常需要几分钟到几小时
- 可以在 Cloudflare Dashboard 查看 DNS 状态
- SSL 证书会自动配置（通常几分钟内完成）

### 4. 验证域名

- 访问你的域名，确认网站正常加载
- 检查 SSL 证书是否已激活（应该显示绿色锁图标）

## 自动部署

配置完成后：

- **每次推送到 `main` 分支**会自动触发生产环境部署
- **每个 Pull Request** 会创建预览部署
- 可以在 **"Deployments"** 标签页查看所有部署历史

## 环境变量管理

### 在 Dashboard 设置

1. 进入 Pages 项目
2. 进入 **"Settings"** → **"Environment variables"**
3. 为 **Production**、**Preview**、**Branch** 分别添加变量
4. 修改后需要重新部署才能生效

### 常用环境变量

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
EXCHANGE_API_URL=https://api.example.com
EXCHANGE_API_KEY=your-api-key
NODE_ENV=production
NODE_VERSION=18
```

## 本地测试（可选）

在部署前可以本地测试构建：

```bash
# 1. 安装依赖
pnpm install

# 2. 构建项目
pnpm build

# 3. 使用 Cloudflare 适配器构建
pnpm pages:build

# 4. 本地预览（需要安装 wrangler）
pnpm wrangler pages dev .vercel/output/static
```

## 常见问题排查

### 构建失败

1. **检查构建日志**：在 Cloudflare Dashboard 的 Deployments 标签页查看详细错误
2. **检查 Node 版本**：确保设置为 18 或 20
3. **检查依赖**：确保 `package.json` 中所有依赖都已正确安装
4. **检查构建命令**：确保命令正确，特别是 `pnpm pages:build`

### 页面无法访问

1. **检查 DNS 配置**：确保 DNS 记录已正确添加
2. **等待 DNS 生效**：可能需要几小时
3. **检查 SSL 证书**：在 Custom domains 标签页查看证书状态

### 环境变量不生效

1. **检查变量名**：客户端变量必须以 `NEXT_PUBLIC_` 开头
2. **重新部署**：修改环境变量后需要重新部署
3. **检查作用域**：确保变量添加到正确的环境（Production/Preview）

## 检查清单

部署前确认：

- [ ] 代码已推送到 Git 仓库
- [ ] 在 Cloudflare 创建了 Pages 项目
- [ ] 配置了正确的构建命令：`pnpm install && pnpm build && pnpm pages:build`
- [ ] 配置了正确的输出目录：`.vercel/output/static`
- [ ] 设置了 Node.js 版本（18 或 20）
- [ ] 设置了包管理器（pnpm）
- [ ] 首次部署成功
- [ ] 测试了网站基本功能
- [ ] 配置了自定义域名（如果需要）
- [ ] DNS 记录已正确配置
- [ ] SSL 证书已激活

## 需要帮助？

如果遇到问题：
1. 查看 Cloudflare Dashboard 中的构建日志
2. 检查 `DEPLOY.md` 和 `cloudflare-deploy.md` 中的详细说明
3. 查看 Cloudflare Pages 官方文档

