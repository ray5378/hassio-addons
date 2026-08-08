#!/bin/sh
# MusicFlow 加载项启动脚本。
#
# 对照主仓库 backend/entrypoint.sh,这里多做两件事:
#   1. 数据目录换成 /share/musicflow —— 加载项升级会重建容器,写在容器里会丢;
#   2. 读 HA 的 /data/options.json,翻成环境变量后再启动后端。
set -e

DATA_DIR="${DATA_DIR:-/share/musicflow}"
export DATA_DIR

# 加载项选项 → 环境变量(mf-options.js 输出 export 语句)
if [ -f /data/options.json ]; then
  eval "$(node /mf-options.js)"
fi

mkdir -p "$DATA_DIR"
# 宿主机映射进来的目录属主是任意的,启动前确保 musicflow 用户可写。
# 目录已经归属正确时跳过,避免每次启动都递归 chown 整个封面缓存。
if [ "$(stat -c %U "$DATA_DIR" 2>/dev/null)" != "musicflow" ]; then
  chown -R musicflow:musicflow "$DATA_DIR" || true
fi

echo "[musicflow-addon] DATA_DIR=${DATA_DIR} PORT=${PORT:-46400} TZ=${TZ:-Asia/Shanghai}"
echo "[musicflow-addon] Web UI: http://<HA 主机 IP>:${PORT:-46400}"

cd /app/backend
exec su-exec musicflow node dist/index.js
