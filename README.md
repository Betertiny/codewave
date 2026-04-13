# 个人博客系统 (Blog CMS) - CodeWave

基于 Next.js + NestJS + Prisma + PostgreSQL 的现代化全栈博客系统。

## ⚠️ 安全提醒

> **重要**: 在部署本项目前，请务必修改以下安全配置：

### 必须修改的配置

1. **数据库密码**
   - 文件: `docker-compose.yml` / `.env`
   - 修改: `POSTGRES_PASSWORD` 默认密码
   ```env
   POSTGRES_PASSWORD=你的强密码
   ```

2. **管理后台默认账号密码**
   - 文件: `blog-admin/src/store/auth.ts`
   - 修改: `DEFAULT_USERNAME` 和 `DEFAULT_PASSWORD`
   ```typescript
   const DEFAULT_USERNAME = '你的管理员用户名';
   const DEFAULT_PASSWORD = '你的强密码';
   ```

3. **API URL**
   - 生产环境务必修改 `NEXT_PUBLIC_API_URL` 为实际后端地址

4. **JWT Secret** (后端)
   - 建议添加 JWT 密钥配置
   ```env
   JWT_SECRET=你的随机密钥
   ```

## 项目概览

```
blog-system/
├── blog-frontend/     # 用户前台 (Next.js 14 App Router)
├── blog-backend/      # 后端 API 服务 (NestJS + Prisma)
└── blog-admin/        # 管理后台 (Next.js 14 App Router)
```

## 技术栈

### 前台 & 管理后台
- **框架**: Next.js 14 (App Router)
- **UI**: NextUI + Tailwind CSS
- **状态管理**: Zustand
- **动画**: Framer Motion

### 后端服务
- **框架**: NestJS 10
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **文档**: Swagger/OpenAPI

## 快速开始

### 1. 环境要求

- Node.js 18+
- PostgreSQL 15+
- npm / yarn / pnpm

### 2. 数据库配置

```bash
# 启动 PostgreSQL (Docker)
docker run -d \
  --name blog-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=Why123456 \
  -e POSTGRES_DB=blog \
  -p 5432:5432 \
  postgres:15-alpine
```

### 3. 后端服务

```bash
cd blog-backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置 DATABASE_URL

# 初始化 Prisma
npm run prisma:generate
npm run prisma:push

# 启动开发服务
npm run start:dev

# API 文档: http://localhost:3001/docs
```

### 4. 前台

```bash
cd blog-frontend

# 安装依赖
npm install

# 启动开发服务
npm run dev

# 访问: http://localhost:3002
```

### 5. 管理后台

```bash
cd blog-admin

# 安装依赖
npm install

# 启动开发服务
npm run dev

# 访问: http://localhost:3003
```

## Docker 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 项目结构

### 后端结构 (NestJS)

```
blog-backend/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app/                    # 根模块
│   ├── prisma/                 # Prisma 服务
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── modules/                 # 功能模块
│       ├── posts/             # 文章管理
│       ├── tags/              # 标签管理
│       ├── categories/        # 分类管理
│       ├── about/             # 关于页面
│       └── upload/            # 文件上传
└── prisma/
    ├── schema.prisma          # 数据模型
    └── seed.ts                # 种子数据
```

### 前台结构 (Next.js)

```
blog-frontend/
├── src/
│   ├── app/                   # 页面 (App Router)
│   │   ├── posts/            # 文章列表/详情
│   │   ├── tags/             # 标签页面
│   │   ├── categories/       # 分类页面
│   │   └── about/            # 关于页面
│   ├── components/           # 公共组件
│   │   ├── Navbar.tsx        # 导航栏
│   │   ├── Footer.tsx       # 页脚
│   │   ├── PostCard.tsx     # 文章卡片
│   │   └── GlassBackground.tsx # 毛玻璃背景
│   ├── lib/                  # 工具函数
│   │   ├── api.ts           # API 请求封装
│   │   └── utils.ts         # 通用工具
│   ├── store/                # 状态管理
│   └── types/                # TypeScript 类型
└── public/                   # 静态资源
```

### 管理后台结构 (Next.js)

```
blog-admin/
├── src/
│   ├── app/                   # 页面 (App Router)
│   │   ├── posts/            # 文章管理
│   │   ├── tags/             # 标签管理
│   │   ├── categories/       # 分类管理
│   │   ├── about/            # 关于页面管理
│   │   ├── account/          # 账户设置
│   │   ├── logs/             # 操作日志
│   │   └── login/            # 登录页面
│   ├── components/           # 公共组件
│   │   ├── Layout.tsx       # 管理后台布局
│   │   ├── Sidebar.tsx      # 侧边栏
│   │   └── Modal.tsx        # 弹窗组件
│   ├── lib/                  # API 封装
│   ├── store/                # 状态管理
│   └── types/                # 类型定义
└── public/
```

## API 接口

### 文章 (Posts)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/posts | 获取文章列表 |
| GET | /api/posts/:slug | 获取文章详情 |
| POST | /api/posts | 创建文章 |
| PATCH | /api/posts/:id | 更新文章 |
| DELETE | /api/posts/:id | 删除文章 |

### 标签 (Tags)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/tags | 获取标签列表 |
| GET | /api/tags/:slug | 获取标签详情 |
| POST | /api/tags | 创建标签 |
| PATCH | /api/tags/:id | 更新标签 |
| DELETE | /api/tags/:id | 删除标签 |

### 分类 (Categories)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/categories | 获取分类列表 |
| POST | /api/categories | 创建分类 |
| PATCH | /api/categories/:id | 更新分类 |
| DELETE | /api/categories/:id | 删除分类 |

### 关于页面 (About)
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/about | 获取关于页面 |
| PUT | /api/about | 更新关于页面 |

### 文件上传 (Upload)
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/upload/file | 上传文件 |
| POST | /api/upload/image | 上传图片 |
| GET | /api/upload/files | 获取文件列表 |
| DELETE | /api/upload/:id | 删除文件 |

## 环境变量

### 后端 (.env)
```env
DATABASE_URL="postgresql://admin:Why123456@localhost:5432/blog?schema=public"
PORT=3001
NODE_ENV=development

# 阿里云 OSS (可选)
OSS_ACCESS_KEY_ID=your_access_key
OSS_ACCESS_KEY_SECRET=your_access_secret
OSS_BUCKET=your_bucket
OSS_REGION=your_region
OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
USE_OSS=true
```

### 前台 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 管理后台 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 功能特性

- [x] 文章管理 (Markdown 编辑、语法高亮)
- [x] 标签系统 (灵活的标签分类)
- [x] 分类管理 (层级分类)
- [x] 关于页面 (个人信息展示)
- [x] 文件上传 (本地/OSS 双支持)
- [x] 用户认证 (JWT)
- [x] 操作日志 (审计追踪)
- [x] 现代化 UI (毛玻璃效果、流畅动画)
- [x] 响应式设计 (完美适配各种设备)

## 许可证

MIT
