# 修复 522 错误（连接超时）完整指南

## 问题说明

522 错误表示 Cloudflare 无法连接到源服务器。对于 Cloudflare Pages，这通常意味着：
1. 部署失败或未完成
2. 缺少 `nodejs_compat` 兼容性标志
3. 构建配置不正确

## 一次性完整解决方案

### ✅ 已完成的配置

我已经完成了以下配置：

1. **wrangler.toml** - 已添加 `nodejs_compat` 标志
2. **.cloudflare/pages.json** - 创建了兼容性标志配置
3. **cloudflare-pages-config.json** - 创建了完整的构建配置参考

### 🔧 在 Cloudflare Dashboard 中需要做的操作

#### 步骤 1：检查部署状态

1. 访问：https://dash.cloudflare.com
2. 进入：**Workers 和 Pages** → **software-hub** → **部署**（Deployments）
3. 检查最新的部署状态：
   - ✅ **成功**：继续步骤 2
   - ❌ **失败**：查看错误日志，然后继续步骤 2

#### 步骤 2：启用兼容性标志（关键步骤）

1. 在项目页面，点击 **"设置"**（Settings）
2. 找到 **"Functions"** 部分
3. 在 **"兼容性标志"**（Compatibility Flags）中：
   - **生产环境**（Production）：
     - 点击 **"添加标志"**（Add Flag）
     - 输入：`nodejs_compat`
     - 保存
   - **预览环境**（Preview）：
     - 同样添加 `nodejs_compat`
     - 保存

#### 步骤 3：验证构建配置

在 **"设置"** → **"构建设置"**（Build settings）中确认：

- **构建命令**：
  ```bash
  npm install && npm run build && npm run pages:build
  ```
- **构建输出目录**：
  ```
  .vercel/output/static
  ```
- **根目录**：留空或 `/`
- **Node.js 版本**：`18` 或 `20`

#### 步骤 4：触发重新部署

1. 返回 **"部署"**（Deployments）标签
2. 如果最新部署失败：
   - 点击 **"重新部署"**（Retry deployment）
3. 如果最新部署成功但网站仍无法访问：
   - 点击 **"重新部署"**（Retry deployment）
4. 等待部署完成（5-10 分钟）

#### 步骤 5：检查自定义域名配置

1. 进入 **"自定义域名"**（Custom domains）标签
2. 确认 `kazsoft.dpdns.org` 的状态：
   - ✅ **有效**：等待 DNS 传播（最多 24 小时）
   - ❌ **无效**：检查 DNS 配置

### 📋 DNS 配置检查清单

确保在 DNS 提供商处配置了正确的记录：

- **类型**：`CNAME`
- **名称**：`kazsoft`（或 `@`）
- **目标**：`software-hub.pages.dev`
- **TTL**：自动或 3600

### 🔍 故障排除

#### 如果仍然看到 522 错误：

1. **检查部署日志**：
   - 在 Cloudflare Pages 的 "部署" 标签查看详细日志
   - 查找任何错误信息

2. **清除 Cloudflare 缓存**：
   - 在 Cloudflare Dashboard → **"缓存"**（Caching）→ **"清除缓存"**（Purge Everything）

3. **检查 DNS 传播**：
   ```bash
   # 在终端运行
   nslookup kazsoft.dpdns.org
   # 或
   dig kazsoft.dpdns.org CNAME
   ```

4. **临时访问 pages.dev 域名**：
   - 访问：https://software-hub.pages.dev
   - 如果这个可以访问，说明问题在 DNS 配置
   - 如果这个也无法访问，说明问题在部署配置

5. **联系 Cloudflare 支持**：
   - 如果以上步骤都无法解决，联系 Cloudflare 支持

### ✅ 验证修复

修复完成后，应该能够：

1. ✅ 访问 https://software-hub.pages.dev（pages.dev 域名）
2. ✅ 访问 https://kazsoft.dpdns.org（自定义域名，可能需要等待 DNS 传播）
3. ✅ 不再看到 522 或 nodejs_compat 错误
4. ✅ 网站正常加载和显示

### 📝 配置摘要

所有必要的配置文件已创建：

- ✅ `wrangler.toml` - Wrangler 配置（包含 nodejs_compat）
- ✅ `.cloudflare/pages.json` - Cloudflare Pages 配置
- ✅ `cloudflare-pages-config.json` - 构建配置参考

### 🚀 下一步

1. **立即操作**：在 Cloudflare Dashboard 中启用兼容性标志（步骤 2）
2. **等待部署**：触发重新部署并等待完成
3. **验证**：访问网站确认修复

## 快速检查清单

- [ ] 在 Cloudflare Dashboard 中启用了 `nodejs_compat` 标志（生产 + 预览）
- [ ] 构建命令正确：`npm install && npm run build && npm run pages:build`
- [ ] 构建输出目录正确：`.vercel/output/static`
- [ ] Node.js 版本设置为 18 或 20
- [ ] 最新部署状态为成功
- [ ] DNS 记录正确配置（CNAME 指向 software-hub.pages.dev）
- [ ] 已清除 Cloudflare 缓存（如果需要）

完成以上所有步骤后，522 错误应该会解决。

