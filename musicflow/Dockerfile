# MusicFlow 加载项 = 主仓库运行镜像 + 一层加载项适配。
#
# 只做两件事:
#   1. DATA_DIR 指到 /share/musicflow —— 主仓库镜像默认写 /app/backend/data,
#      那是容器内路径,加载项升级会重建容器,数据就没了。
#   2. 换掉 ENTRYPOINT —— 主仓库的 entrypoint.sh 不认识 HA 的
#      /data/options.json,这里用 run.sh 先把选项翻成环境变量再启动。
ARG BUILD_FROM
FROM ${BUILD_FROM}

ENV DATA_DIR=/share/musicflow

COPY mf-options.js /mf-options.js
COPY run.sh /run.sh
RUN chmod a+x /run.sh

WORKDIR /app/backend

# 覆盖基础镜像的 ENTRYPOINT ["/app/backend/entrypoint.sh"]
ENTRYPOINT ["/run.sh"]
CMD []
