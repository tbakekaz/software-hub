# Cloudflare Pages nodejs_compat 兼容性标志配置指南

## 问题说明

如果看到错误："Node.js 兼容性错误 未nodejs_compat设置兼容性标志"，需要在 Cloudflare Pages 项目中启用 `nodejs_compat` 兼容性标志。

## 解决方案

### 方法一：在 Cloudflare Dashboard 中设置（推荐）

#### 步骤 1：进入 Pages 项目设置

1. 登录 Cloudflare Dashboard：https://dash.cloudflare.com
2. 左侧菜单选择 **"Workers 和 Pages"**（Workers & Pages）
3. 点击项目 **"software-hub"**
4. 点击 **"设置"**（Settings）标签

#### 步骤 2：配置兼容性标志

1. 在设置页面，找到 **"兼容性标志"**（Compatibility Flags）或 **"Functions"** 部分
2. 找到 **"兼容性标志"**（Compatibility Flags）设置
3. 为 **"生产环境"**（Production）添加：
   - 点击 **"添加标志"**（Add Flag）
   - 选择或输入：`nodejs_compat`
   - 保存
4. 为 **"预览环境"**（Preview）添加：
   - 同样添加 `nodejs_compat` 标志
   - 保存

#### 步骤 3：重新部署

1. 返回 **"部署"**（Deployments）标签
2. 找到最新的部署
3. 点击 **"重新部署"**（Retry deployment）或等待新的自动部署

### 方法二：通过 wrangler.toml 配置（已配置）

我已经在 `wrangler.toml` 文件中添加了兼容性标志：

```toml
compatibility_flags = ["nodejs_compat"]
```

这会在下次部署时自动应用。

## 验证配置

配置完成后：

1. **等待新的部署完成**（通常 5-10 分钟）
2. **访问网站**：https://software-hub.pages.dev
3. **检查是否正常**：应该不再显示 Node.js 兼容性错误

## 如果仍然有问题

1. **检查部署日志**：
   - 在 Cloudflare Pages 的 "部署" 标签查看构建日志
   - 确认没有错误

2. **清除浏览器缓存**：
   - 按 `Cmd+Shift+R`（Mac）或 `Ctrl+Shift+R`（Windows）强制刷新

3. **检查兼容性标志**：
   - 在 Cloudflare Dashboard 的 "设置" → "兼容性标志" 中确认 `nodejs_compat` 已启用

## 详细步骤（截图说明）

### 在 Cloudflare Dashboard 中设置：

1. **进入项目设置**：
   - Workers 和 Pages → software-hub → 设置

2. **找到兼容性标志设置**：
   - 在设置页面中查找 "兼容性标志" 或 "Compatibility Flags"
   - 可能在 "Functions" 或 "高级设置" 部分

3. **添加标志**：
   - 点击 "添加标志" 或 "Add Flag"
   - 输入：`nodejs_compat`
   - 确保同时为 "生产" 和 "预览" 环境添加

4. **保存并重新部署**：
   - 保存设置
   - 触发新的部署（或等待自动部署）

## 注意事项

- 兼容性标志需要在 **生产环境** 和 **预览环境** 中都设置
- 设置后需要重新部署才能生效
- 如果通过 `wrangler.toml` 配置，会在下次部署时自动应用

