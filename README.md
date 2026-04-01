# 客户管理系统

前端为 Vue 3 + Vite + Element Plus，当前为纯前端 Mock 模式，客户数据持久化在浏览器 localStorage。

## 服务端口

| 服务     | 端口 | 说明 |
|----------|------|------|
| 前端页面 | 8081 | Docker 映射为 `8081:80`，本地开发为 Vite 默认端口 |
| 后端 API | 8080 | 若接入后端，可在 nginx 中配置 `/api` 代理到后端 8080 |

## 本地开发

```bash
cd frontend-admin
npm install --legacy-peer-deps
npm run dev
```

本地开发时前端默认运行在 Vite 配置的端口（如 5173），预览可配为 8081。

## Docker 构建与运行

```bash
# 构建（支持 amd64 / arm64）
docker compose build

# 运行
docker compose up -d
```

访问：http://localhost:8081

## 测试账号

前端已内置两组 Mock 测试账号，可直接在登录页使用：

| 账号  | 密码   | 角色         | 说明                         |
|-------|--------|--------------|------------------------------|
| admin | 123456 | 超级管理员   | 拥有全部菜单与客户管理权限   |
| user  | 123456 | 普通用户     | 仅可查看客户列表，受限操作   |

> 注意：当前为纯前端 Mock 登录，账号信息不会真实写入后端。

## 题目内容

使用 JavaScript 技术、Vue、Element-Plus框架，开发客户管理，完成某系统登录页面，以及一个功能模块增、删、改、查功能的开发。

## 项目结构

```
label-03291/
├── docker-compose.yml    # 前端 8081，预留后端 8080、数据库 3307
├── README.md
└── frontend-admin/
    ├── Dockerfile        # 多阶段构建：Node 构建 + Nginx 运行
    ├── nginx.conf        # 静态资源 + 可选 /api 代理
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/         # 请求封装、Mock、客户 API（含 localStorage 持久化）
        ├── components/  # 布局（侧栏、顶栏）
        ├── router/
        ├── stores/      # Pinia：登录态、客户列表
        ├── styles/      # 全局样式与变量
        ├── utils/       # 如密码加密
        └── views/       # 登录、仪表盘、客户管理
```

## 登录说明

- 登录态使用 Token，带过期时间，过期后需重新登录。
- 密码在前端经 SHA-256 哈希后传给接口，Mock 环境下按约定账号校验。

## 数据库与编码（若接入后端）

- 若使用 MySQL，建议宿主机端口映射为 **3307:3306**，避免与本地 3306 冲突。
- 数据库建议使用 **utf8mb4** 及 **utf8mb4_unicode_ci**，避免中文乱码。

## 多架构说明

- Docker 构建已配置 `platforms: [linux/amd64, linux/arm64]`，便于在 x86 与 Apple Silicon 等环境构建运行。
