#!/bin/bash
# 旅行规划助手 - 公网隧道启动脚本
# 用法: bash tunnel.sh
#
# ngrok 首次使用需要注册免费账号:
# 1. 打开 https://dashboard.ngrok.com/signup 注册
# 2. 复制你的 authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
# 3. 执行: ngrok config add-authtoken <你的token>
# 4. 然后重新运行 bash tunnel.sh

set -e

echo "========================================"
echo "  公网隧道"
echo "========================================"

# 检查本地服务是否运行
if ! curl -s -o /dev/null -w "" http://localhost:3000 2>/dev/null; then
  echo "❌ 本地服务未启动 (localhost:3000)"
  echo "   请先在另一个终端运行: cd trip_calender/trip_calender && bash dev.sh"
  exit 1
fi

echo "✅ 本地服务运行中 (localhost:3000)"

if command -v ngrok &> /dev/null; then
  echo ""
  echo "🔗 使用 ngrok (推荐)"
  echo "   启动后在输出中找到 Forwarding 那一行，格式:"
  echo "   https://xxxx-xx-xx-xxx-xx.ngrok-free.app -> http://localhost:3000"
  echo "   把 ngrok-free.app 的链接发到微信群即可"
  echo "   没有验证页面，国内手机直接打开！"
  echo ""
  ngrok http 3000
else
  echo "🔗 使用 localtunnel..."
  npx -y localtunnel --port 3000
fi
