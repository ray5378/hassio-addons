<<<<<<< HEAD
# hassio-addons
Home Assistant Add-on repository for MusicFlow
=======
# MusicFlow Home Assistant Add-on Repository

本仓库为 [MusicFlow](https://github.com/ray5378/MusicFlow) 提供 Home Assistant 加载项(Add-on)。

## 安装

1. 进入 Home Assistant → **设置 → 加载项 → 加载项商店**
2. 点击右上角 **⋮ → 仓库**
3. 填入仓库地址:`https://github.com/ray5378/hassio-addons`
4. 点击 **添加**,关闭对话框
5. 在加载项商店搜索 **MusicFlow** → 点击 **安装**
6. 安装后建议开启:**开机启动**、**Watchdog**、(可选)**自动更新**
7. 点击 **启动**,然后在 HA 侧边栏会出现 **MusicFlow** 入口

## 配置

加载项的可选项(对应 MusicFlow 主仓库的环境变量):

| 选项 | 默认 | 说明 |
|---|---|---|
| `jwt_secret` | 空(首次自动生成并持久化) | JWT 签名密钥,留空即可 |
| `cors_origins` | `*` | 允许的跨域来源 |
| `play_history_retention_days` | `3` | 播放历史保留天数 |
| `tz` | `Asia/Shanghai` | 时区 |

## 数据持久化

数据卷挂载到 `/share/musicflow`,对应主仓库的 `./data`。备份/迁移只需备份该目录。

## 重要:关于 HA 集成(控制 DLNA)

本加载项只负责把 MusicFlow 服务端跑在 HA Supervisor 管理下,并提供侧边栏 Web UI。

如果希望在 HA 仪表盘里**查看/控制 DLNA 播放器、浏览曲库**,还需要安装配套的集成:

1. 先安装 [HACS](https://hacs.xyz/)
2. HACS → 集成 → 右上角 **⋮ → 自定义仓库**
3. 填入:`https://github.com/ray5378/hass-musicflow`,类别选 **Integration**
4. 搜索 **MusicFlow** → 下载
5. **重启 Home Assistant**
6. 设置 → 设备与服务 → 添加集成 → **MusicFlow**

如果 MusicFlow 加载项已在运行,集成会通过 Zeroconf 自动发现,无需手动填写地址。

## 网络说明

加载项使用 `host_network: true`,这是 DLNA SSDP 多播发现的必需条件(详见 MusicFlow 主仓库的 docker-compose 说明)。仅支持 HA OS / HA Supervised。

## 相关仓库

- MusicFlow 服务端:https://github.com/ray5378/MusicFlow
- HA 集成:https://github.com/ray5378/hass-musicflow
>>>>>>> a70797b (feat: initial MusicFlow HA add-on (config.yaml + README))
