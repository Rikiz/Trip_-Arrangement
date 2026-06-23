#!/bin/bash
# 旅行规划助手 - 启动脚本
# 用法: bash start.sh

set -e

cd "$(dirname "$0")"

echo "========================================"
echo "  旅行规划助手 - 本地开发服务"
echo "========================================"

# 安装依赖（首次运行）
if [ ! -d "node_modules" ]; then
  echo "📦 首次运行，安装依赖..."
  npm install
fi

echo "🚀 启动开发服务器..."
npx next dev -p 3000
