# DNS 配置详细指南 - kazsoft.dpdns.org

## 当前情况

根据 Cloudflare Pages 的提示，需要将 DNS 记录从：
- **现有记录**：`AAAA` 类型，`kazsoft` -> `100::`
- **新记录**：`CNAME` 类型，`kazsoft` -> `software-hub.pages.dev`

## 详细配置步骤

### 方法一：如果域名在 Cloudflare 管理（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 登录你的账号

2. **进入 DNS 管理**
   - 左侧菜单选择 **"网站"**（Websites）
   - 点击域名 **`dpdns.org`**
   - 点击 **"DNS"** 标签

3. **删除现有 AAAA 记录**
   - 找到类型为 `AAAA`，名称为 `kazsoft` 的记录
   - 点击该记录右侧的 **"编辑"**（铅笔图标）
   - 点击 **"删除"** 确认删除

4. **添加新的 CNAME 记录**
   - 点击 **"添加记录"**（Add record）
   - 填写：
     - **类型**：选择 `CNAME`
     - **名称**：输入 `kazsoft`
     - **目标**：输入 `software-hub.pages.dev`
     - **代理状态**：选择 **"仅 DNS"**（灰色云朵，不代理）
     - **TTL**：选择 `自动`
   - 点击 **"保存"**

5. **返回 Cloudflare Pages**
   - 回到 Pages 项目页面
   - 进入 **"自定义域"** 标签
   - 点击 **"激活域"** 按钮
   - 等待验证完成（通常几分钟）

### 方法二：如果域名不在 Cloudflare 管理

1. **找到你的 DNS 提供商**
   - 登录你的域名注册商（如 GoDaddy、Namecheap、阿里云等）
   - 进入域名管理 → DNS 设置

2. **删除现有 AAAA 记录**
   - 找到类型为 `AAAA`，主机名为 `kazsoft` 的记录
   - 删除该记录

3. **添加新的 CNAME 记录**
   - 点击 **"添加记录"** 或 **"Add Record"**
   - 填写：
     - **类型**：`CNAME`
     - **主机名/名称**：`kazsoft`（或 `@`，取决于你的 DNS 提供商）
     - **目标/值**：`software-hub.pages.dev`
     - **TTL**：`3600` 或 `自动`
   - 保存

4. **等待 DNS 传播**
   - DNS 记录生效通常需要 5 分钟到 24 小时
   - 可以使用以下命令检查：
     ```bash
     dig kazsoft.dpdns.org CNAME
     # 或
     nslookup -type=CNAME kazsoft.dpdns.org
     ```

5. **返回 Cloudflare Pages 激活**
   - 等待 DNS 记录生效后
   - 返回 Cloudflare Pages 项目
   - 点击 **"激活域"** 按钮

## 验证 DNS 配置

### 方法 1：使用 dig 命令（macOS/Linux）

```bash
# 检查 CNAME 记录
dig kazsoft.dpdns.org CNAME +short

# 应该返回：software-hub.pages.dev
```

### 方法 2：使用 nslookup（Windows/macOS/Linux）

```bash
nslookup -type=CNAME kazsoft.dpdns.org

# 应该显示指向 software-hub.pages.dev
```

### 方法 3：在线工具

访问以下网站检查 DNS 记录：
- https://dnschecker.org
- https://www.whatsmydns.net
- https://mxtoolbox.com/DNSLookup.aspx

输入 `kazsoft.dpdns.org`，选择 `CNAME` 类型，查看是否指向 `software-hub.pages.dev`

## 关于 API 错误

如果看到 "API Request Failed: GET /api/v4/memberships" 错误：

1. **这是 Cloudflare 的临时服务问题**，不影响 DNS 配置
2. **解决方法**：
   - 刷新页面（F5 或 Cmd+R）
   - 等待几分钟后重试
   - 如果持续出现，可以稍后再试

## 完成后的检查

配置完成后，检查以下内容：

1. **DNS 记录正确**
   ```bash
   dig kazsoft.dpdns.org CNAME
   # 应该返回：software-hub.pages.dev
   ```

2. **SSL 证书已配置**
   - 在 Cloudflare Pages 的 "自定义域" 标签查看
   - 状态应该显示为 "有效" 或 "Active"

3. **网站可以访问**
   - 访问：https://kazsoft.dpdns.org
   - 应该能看到你的网站
   - 浏览器地址栏应该显示绿色锁图标（SSL 证书）

4. **功能正常**
   - 测试软件列表页面
   - 测试教程页面
   - 测试 AI 导航页面
   - 测试多语言切换

## 常见问题

### Q: DNS 记录更新后多久生效？
A: 通常 5 分钟到 24 小时，取决于你的 DNS 提供商和 TTL 设置。

### Q: 为什么需要删除 AAAA 记录？
A: 因为一个主机名不能同时有 AAAA 和 CNAME 记录。CNAME 记录会覆盖 AAAA 记录。

### Q: 如果域名在 Cloudflare 管理，为什么还要手动配置？
A: 如果 DNS 记录被标记为"只读"，可能是权限问题。需要：
1. 检查 Cloudflare 账号权限
2. 或者手动在 DNS 设置中配置

### Q: SSL 证书需要多久才能配置？
A: 通常 5-15 分钟，Cloudflare 会自动为你的域名配置 SSL 证书。

## 需要帮助？

如果遇到问题：
1. 检查 DNS 记录是否正确配置
2. 等待 DNS 传播完成
3. 清除浏览器缓存
4. 检查 Cloudflare Pages 部署状态

