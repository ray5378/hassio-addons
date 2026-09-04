# MusicFlow Home Assistant Add-on Repository

本仓库为 [MusicFlow](https://github.com/ray5378/MusicFlow) 提供 Home Assistant 加载项(Add-on)。

MusicFlow 是自托管音乐库播放器,兼容 OpenSubsonic,支持 DLNA 投流与设备编组。

> 本加载项运行的是 **MusicFlow**（插件化架构的自托管音乐库播放器）。

## 安装

1. 进入 Home Assistant → **设置 → 加载项 → 加载项商店**
2. 点击右上角 **⋮ → 仓库**
3. 填入仓库地址:`https://github.com/ray5378/hassio-addons`
4. 点击 **添加**,关闭对话框
5. 在加载项商店搜索 **MusicFlow** → 点击 **安装**
6. 安装后建议开启:**开机启动**、**Watchdog**、(可选)**自动更新**
7. 点击 **启动**,再点击 **打开 Web UI**

> 首次启动会自动创建管理员账号 `admin / admin`,登录后请立即修改密码。

## 配置

加载项选项(对应 MusicFlow 主仓库的环境变量):

| 选项 | 默认 | 说明 |
|---|---|---|
| `jwt_secret` | 空(首次自动生成并持久化) | JWT 签名密钥,留空即可 |
| `cors_origins` | `*` | 允许的跨域来源 |
| `play_history_retention_days` | `3` | 播放历史保留天数 |
| `tz` | `Asia/Shanghai` | 时区 |
| `dlna_base_url` | 空(自动探测) | DLNA 设备回拉音频流时使用的基地址,例如 `http://192.168.1.10:46400`。多网卡环境下自动探测到错误网卡时才需要手动填写 |

## 数据持久化

数据目录挂载在 `/share/musicflow`(加载项内通过 `DATA_DIR` 指向该路径),对应主仓库 docker-compose 里的 `./data`。
加载项升级、重装都不会丢数据;备份/迁移只需备份该目录。

## 网络说明

加载项使用 `host_network: true`,这是 DLNA 的 SSDP 多播发现所必需的(与主仓库 docker-compose 一致)。

因为共享宿主网络且前端使用绝对路径,**本加载项不启用 Ingress**,而是通过 `webui` 直接跳转到 `http://<HA地址>:46400`。
这意味着:

- 侧边栏不会出现 MusicFlow 图标,请从加载项页面的 **打开 Web UI** 进入(可在加载项页面开启"在侧边栏显示"以直链形式添加)
- 需要保证 46400 端口在局域网内可达
- 仅支持 HA OS / HA Supervised(Container 版无 Supervisor,请直接用 Docker 部署主仓库镜像)

## 重要:关于 HA 集成(在仪表盘里控制播放)

本加载项只负责把 MusicFlow 服务端跑在 HA Supervisor 管理下。

如果希望在 HA 仪表盘里**查看/控制 DLNA 播放器与播放组、浏览歌单曲库**,还需要安装配套集成:

**第一步:在 MusicFlow 里生成 API Key**(集成用它作长期凭据,登录 Token 24 小时就过期)

打开 MusicFlow Web UI,两个入口任选:

- **给自己**:**设置** → **API Key** → **生成** → **复制**
- **给指定用户**(管理员):**管理 → 用户管理** → 对应用户卡片 → **API Key** → **生成** → **复制**

建议单独建一个 `homeassistant` 账号发 Key,撤销时不影响自己日常登录。
注意改密码会使该用户的 Key 失效,请先改密码再生成。

**第二步:安装集成**

1. 先安装 [HACS](https://hacs.xyz/)
2. HACS → 右上角 **⋮ → 自定义仓库**
3. 填入:`https://github.com/ray5378/hass-musicflow`,类别选 **Integration**
4. 搜索 **MusicFlow** → 下载
5. **重启 Home Assistant**
6. 设置 → 设备与服务 → 添加集成 → **MusicFlow**
7. 粘贴刚才复制的 API Key

如果 MusicFlow 加载项已在运行,集成会通过 Zeroconf 自动发现,地址会自动填好,只需补 API Key。

集成会为每个 DLNA 设备和播放组创建 `media_player` 实体,支持播放/暂停/上一首/下一首/音量/进度/循环模式,以及媒体浏览(歌单 / 专辑 / 艺术家 / 流派)。

## 国际化（i18n）

本仓库为 shell / 部署层（addon 配置与容器编排），无面向用户的 UI 文案，当前无 i18n 任务。若后续 addon 暴露面向用户的可配置项文案，再接入 HASS 多语言（上层集成 / 卡片的 i18n 见各自仓库）。

## 相关仓库

- MusicFlow 服务端:https://github.com/ray5378/MusicFlow
- HA 集成:https://github.com/ray5378/hass-musicflow
