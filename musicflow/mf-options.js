// 把 HA 加载项的 /data/options.json 翻译成 MusicFlow 认识的环境变量。
//
// 基础镜像是 node:22-alpine,里面既没有 jq 也没有 bashio,但一定有 node,
// 所以用 node 解析最省事。输出是可以被 sh eval 的 export 语句。
const fs = require("fs");

// 加载项选项 → 主仓库 docker-compose.yml 里的环境变量
const MAP = {
  jwt_secret: "JWT_SECRET",
  cors_origins: "CORS_ORIGINS",
  play_history_retention_days: "PLAY_HISTORY_RETENTION_DAYS",
  tz: "TZ",
  dlna_base_url: "DLNA_BASE_URL",
  // 覆盖官方插件注册表地址(内网镜像 / 离线环境),留空用默认官方 URL
  official_registry: "MUSICFLOW_OFFICIAL_REGISTRY",
};

let options = {};
try {
  options = JSON.parse(fs.readFileSync("/data/options.json", "utf8")) || {};
} catch {
  options = {};
}

// 单引号包裹 + 转义内部单引号,防止密钥里的特殊字符破坏 eval
const quote = (value) => "'" + String(value).replace(/'/g, "'\\''") + "'";

for (const [key, envName] of Object.entries(MAP)) {
  const value = options[key];
  // 留空的选项不导出,让后端走自己的默认值
  // (例如 JWT_SECRET 为空时会自动生成并持久化到 DATA_DIR/.jwt-secret)
  if (value === undefined || value === null || value === "") continue;
  process.stdout.write(`export ${envName}=${quote(value)}\n`);
}
