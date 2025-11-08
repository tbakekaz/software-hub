#!/bin/bash

# 推送代码到 GitHub 的脚本
# 使用方法：在终端执行 ./push-to-github.sh

cd /Users/Zhuanz/my-project

echo "准备推送到 GitHub..."
echo "仓库地址: https://github.com/tbakekaz/software-hub.git"
echo ""
echo "如果提示输入用户名和密码："
echo "  - 用户名：你的 GitHub 用户名"
echo "  - 密码：使用 Personal Access Token（不是 GitHub 密码）"
echo ""
echo "如果还没有 Token，请访问："
echo "  https://github.com/settings/tokens"
echo "  点击 'Generate new token' → 选择 'repo' 权限 → 生成后复制 Token"
echo ""
echo "按 Enter 继续推送..."
read

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo "现在可以在 Cloudflare Pages 配置页面刷新，应该能看到 'main' 分支了。"
else
    echo ""
    echo "❌ 推送失败。"
    echo "请检查："
    echo "  1. GitHub 仓库是否存在：https://github.com/tbakekaz/software-hub"
    echo "  2. 是否已配置正确的认证信息"
    echo "  3. 或者使用 GitHub Desktop 等工具推送"
fi

