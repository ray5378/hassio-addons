# MusicFlow Add-on

自托管音乐库播放器 [MusicFlow-V2](https://github.com/ray5378/MusicFlow-V2)(插件化内核,OpenSubsonic 兼容)的 Home Assistant 加载项。

> **注意**:本加载项基于 V2 镜像 `ghcr.io/ray5378/musicflow-v2` 构建,**仅支持 amd64**
> (账号没有 ARM runner,暂不提供 aarch64 镜像)。
> 当前版本 **1.4.0**(V2 内核,外置插件运行于 QuickJS 沙箱,host.* 能力全量开放:
> `http` / `storage` / `comm` / `songs` / `fs` / `command` / `net` / `ws` / `jsenv` 均经权限执行点;
> `official_registry` 选项可覆盖插件注册表)。

## 快速开始

1. 在 HA 加载项商店添加仓库 `https://github.com/ray5378/hassio-addons`
2. 安装 **MusicFlow** → **启动**
3. 点击 **打开 Web UI**(地址为 `http://<HA地址>:46400`)
4. 首次启动自动创建管理员 `admin / admin`,登录后请立即改密
5. 在 Web UI 的"设置 → 音乐库"里添加音乐目录并扫描

## 音乐文件放哪里

加载项映射了 HA 的 `share` 目录(读写)。建议把音乐放到 `/share/music`,
然后在 MusicFlow Web UI 里把音乐库路径填成 `/share/music`。

数据库、封面缓存、插件数据等运行数据存放在 `/share/musicflow`,升级加载项不会丢失。
在线源插件(go-music-dl 等)可在 Web UI 的"插件"页从官方注册表一键安装。

## 选项

| 选项 | 默认 | 说明 |
|---|---|---|
| `jwt_secret` | 空 | JWT 签名密钥,留空则首次启动自动生成并持久化 |
| `cors_origins` | `*` | 允许的跨域来源 |
| `play_history_retention_days` | `3` | 播放历史保留天数 |
| `tz` | `Asia/Shanghai` | 时区 |
| `dlna_base_url` | 空 | DLNA 设备回拉音频流的基地址,如 `http://192.168.1.10:46400`。多网卡环境自动探测出错时才需填 |
| `official_registry` | 空 | 覆盖官方插件注册表地址(内网镜像 / 离线环境)。留空用默认官方 URL |

## 网络

使用 `host_network: true`(DLNA SSDP 多播发现所需),因此不启用 Ingress,
Web UI 通过 46400 端口直链访问。仅支持 HA OS / HA Supervised。

## 配合 HA 集成使用

要在 HA 仪表盘控制 DLNA 播放器 / 播放组、浏览曲库,请额外安装集成
[`hass-musicflow`](https://github.com/ray5378/hass-musicflow)(通过 HACS 自定义仓库添加)。
加载项运行后,集成会通过 Zeroconf 自动发现本服务。
