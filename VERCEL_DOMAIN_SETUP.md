# 🌐 Vercel 域名配置完整指南

## 📊 当前状态

从 Vercel Dashboard 看到：
- ⚠️ 域名 `kazsoft.dpdns.org` 需要验证
- ⚠️ 警告：此域名已链接到另一个 Vercel 账号
- ✅ 需要添加 DNS 记录来验证所有权

## 🔧 配置步骤

### 步骤 1：添加 TXT 记录（验证所有权）

**这是最重要的步骤！**

1. **登录你的 DNS 提供商**（可能是 Cloudflare、Namecheap、GoDaddy 等）
2. **找到域名管理页面**：`kazsoft.dpdns.org`
3. **添加 TXT 记录**：
   - **类型**：`TXT`
   - **名称/主机名**：`_vercel`
   - **值/内容**：`vc-domain-verify=kazsoft.dpdns.org,cddb7b4d1685b8...`（完整值在 Vercel Dashboard 中显示）
   - **TTL**：自动或 3600

4. **保存记录**

### 步骤 2：添加 A 记录（指向 Vercel）

1. **在同一个 DNS 管理页面**
2. **添加 A 记录**：
   - **类型**：`A`
   - **名称/主机名**：`@` 或 `kazsoft.dpdns.org`（取决于你的 DNS 提供商）
   - **值/内容**：`216.198.79.1`
   - **TTL**：自动或 3600

3. **保存记录**

### 步骤 3：等待 DNS 传播

- DNS 记录通常需要 **5-30 分钟** 才能生效
- 有时可能需要 **最多 48 小时**

### 步骤 4：在 Vercel 中验证

1. **回到 Vercel Dashboard**
2. **点击 "Refresh"（刷新）按钮**
3. **等待验证完成**

## 📋 DNS 记录配置清单

### 需要添加的记录：

1. **TXT 记录**（验证所有权）：
   ```
   类型: TXT
   名称: _vercel
   值: vc-domain-verify=kazsoft.dpdns.org,cddb7b4d1685b8...（完整值）
   TTL: 3600
   ```

2. **A 记录**（指向 Vercel）：
   ```
   类型: A
   名称: @ 或 kazsoft.dpdns.org
   值: 216.198.79.1
   TTL: 3600
   ```

## 🎯 不同 DNS 提供商的配置方法

### Cloudflare

1. 登录 Cloudflare Dashboard
2. 选择域名 `dpdns.org`
3. 点击 "DNS" → "Records"
4. 点击 "Add record"
5. 添加 TXT 记录：
   - Type: `TXT`
   - Name: `_vercel`
   - Content: `vc-domain-verify=kazsoft.dpdns.org,cddb7b4d1685b8...`
   - TTL: Auto
6. 添加 A 记录：
   - Type: `A`
   - Name: `kazsoft`（或 `@`）
   - IPv4 address: `216.198.79.1`
   - TTL: Auto
7. 保存

### 其他 DNS 提供商

配置方法类似，只是界面可能不同：
- **Namecheap**: Domain List → Manage → Advanced DNS
- **GoDaddy**: DNS Management → Records
- **Name.com**: DNS Records → Add Record

## ⚠️ 重要提示

1. **TXT 记录是必需的**：用于验证域名所有权
2. **A 记录是必需的**：用于将域名指向 Vercel
3. **等待时间**：DNS 记录需要时间传播，请耐心等待
4. **验证后可以删除 TXT 记录**：验证完成后，可以删除 `_vercel` TXT 记录（但 A 记录必须保留）

## 🔍 验证 DNS 记录是否生效

可以使用以下命令检查：

```bash
# 检查 TXT 记录
dig TXT _vercel.kazsoft.dpdns.org

# 检查 A 记录
dig A kazsoft.dpdns.org
```

或者使用在线工具：
- https://dnschecker.org/
- https://www.whatsmydns.net/

## 🚀 完成后的步骤

1. **等待 DNS 传播**（5-30 分钟）
2. **在 Vercel Dashboard 中点击 "Refresh"**
3. **等待验证完成**
4. **访问你的网站**：`https://kazsoft.dpdns.org`

## 📝 如果验证失败

1. **检查 DNS 记录是否正确**：确保名称和值完全匹配
2. **等待更长时间**：DNS 传播可能需要更长时间
3. **检查 DNS 提供商设置**：确保没有冲突的记录
4. **联系 Vercel 支持**：如果问题持续存在

## 💡 提示

- 如果域名之前链接到另一个 Vercel 账号，需要先在那个账号中移除域名
- 或者使用 TXT 记录验证所有权（当前方法）
- 验证完成后，域名会自动指向你的 Vercel 项目

