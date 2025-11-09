# 🚀 Vercel 部署完整指南

## ✅ 已完成的代码修改

为了适配 Vercel，我已经完成了以下修改：

1. ✅ **恢复 `cookies()` 功能** - `lib/i18n/server.ts`
   - Vercel 完全支持 `cookies()`，不需要禁用

2. ✅ **优化 `next.config.mjs`**
   - 移除了 `unoptimized: true`（Vercel 支持图片优化）
   - 移除了特殊的 webpack 配置（Vercel 不需要）

3. ✅ **恢复 Layout 功能**
   - 恢复了 CSS 导入
   - 恢复了 `getCurrentLang()` 调用
   - 恢复了所有组件（Navbar、Footer、MonetizeSlot）

4. ✅ **恢复 API 路由功能**
   - 恢复了 `/api/debug` 中的 cookies 测试

## 📋 Vercel 部署步骤

### 第一步：创建 Vercel 账号

1. 访问：https://vercel.com
2. 点击右上角 **"Sign Up"**
3. 选择 **"Continue with GitHub"**（推荐）
4. 授权 Vercel 访问你的 GitHub 账号

### 第二步：导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在仓库列表中找到：`tbakekaz/software-hub`
3. 点击 **"Import"**

### 第三步：配置项目（通常自动检测）

Vercel 会自动检测 Next.js 项目，通常不需要修改：

- **Framework Preset**: `Next.js`（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `pnpm build`（自动检测）
- **Output Directory**: `.next`（自动检测）
- **Install Command**: `pnpm install`（自动检测）

**重要**：确保使用 `pnpm` 作为包管理器（因为你的项目使用 `pnpm`）

### 第四步：环境变量（如果需要）

如果你的项目需要环境变量，在 **"Environment Variables"** 中添加：

- `NEXT_PUBLIC_GA_ID`（如果有 Google Analytics）
- `EXCHANGE_API_URL`（如果有汇率 API）
- `EXCHANGE_API_KEY`（如果有汇率 API）

### 第五步：部署

1. 点击 **"Deploy"**
2. 等待构建完成（约 2-5 分钟）
3. 部署完成后会得到一个 URL，例如：`https://software-hub-xxx.vercel.app`

### 第六步：绑定自定义域名（可选）

1. 在项目页面，点击 **"Settings"** → **"Domains"**
2. 点击 **"Add Domain"**
3. 输入你的域名：`kazsoft.dpdns.org`
4. 按照提示配置 DNS：
   - 添加 CNAME 记录：`kazsoft.dpdns.org` → `cname.vercel-dns.com`
   - 或者添加 A 记录（Vercel 会提供 IP 地址）

## 🎯 Vercel 的优势

- ✅ **零配置**：自动检测 Next.js 项目
- ✅ **原生支持**：完全支持 Next.js 15 的所有功能
- ✅ **Edge Runtime**：完全支持 Edge Runtime 和 `cookies()`
- ✅ **自动 HTTPS**：自动配置 SSL 证书
- ✅ **全球 CDN**：自动分发到全球边缘节点
- ✅ **自动部署**：每次 push 到 GitHub 自动部署
- ✅ **预览部署**：每个 PR 都有独立的预览 URL

## 📊 免费计划限制

- 100GB 带宽/月
- 100 次构建/天
- 对于个人项目通常足够

## 🚀 下一步

1. 提交并推送代码到 GitHub
2. 在 Vercel 导入项目
3. 点击部署
4. 等待 2-5 分钟
5. 访问你的网站！

## 📝 注意事项

1. **包管理器**：确保 Vercel 使用 `pnpm`（在项目设置中可以配置）
2. **构建命令**：Vercel 会自动运行 `prebuild`（因为它在 `package.json` 中）
3. **Node.js 版本**：Vercel 会自动使用 `package.json` 中指定的版本

## 🎉 完成！

部署完成后，你的网站应该可以正常工作了！

如果遇到任何问题，可以：
1. 查看 Vercel Dashboard 中的构建日志
2. 查看部署日志
3. 检查环境变量配置

