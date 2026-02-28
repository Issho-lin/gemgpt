# GemGPT 后端服务开发指南

本文档旨在帮助开发者快速了解 GemGPT 后端服务 (`gemgpt/apps/service`) 的架构、开发流程及数据库操作规范。

## 1. 技术栈概览

- **框架**: [NestJS](https://nestjs.com/) (v11+) - 渐进式 Node.js 框架。
- **ORM**: [Prisma](https://www.prisma.io/) (v5.22) - 下一代 ORM，提供类型安全的数据库访问。
- **数据库**: PostgreSQL (启用 `pgvector` 扩展支持向量存储)。
- **认证**: Passport.js + JWT。

## 2. 目录结构

```text
gemgpt/apps/service/
├── src/
│   ├── app.module.ts       # 根模块，注册所有功能模块
│   ├── main.ts             # 入口文件
│   ├── prisma/             # 数据库相关
│   │   ├── schema.prisma   # 【核心】数据库表结构定义
│   │   ├── migrations/     # 数据库迁移历史 (Git 这一样的版本记录)
│   │   └── seed.ts         # 初始数据填充脚本
│   ├── auth/               # 认证模块
│   ├── models/             # 模型管理模块 (示例)
│   └── ...
├── package.json
└── tsconfig.json
```

## 3. 数据库操作工作流 (Prisma)

### 3.1 核心概念

- **Schema (`schema.prisma`)**: 数据库的“设计图纸”，定义了所有表结构。
- **Migrations (`prisma/migrations`)**: 数据库的“变更历史”，记录了每一次结构修改的 SQL。
- **Seed (`prisma/seed.ts`)**: 数据库的“初始数据”，用于填充系统运行必须的基础数据。

### 3.2 开发环境工作流 (Development)

当你需要修改数据库结构（如新增表、修改字段）时：

1.  **修改定义**: 编辑 `prisma/schema.prisma` 文件。
2.  **生成迁移**: 运行以下命令：
    ```bash
    npx prisma migrate dev --name <本次变更的描述>
    # 例如: npx prisma migrate dev --name add_todo_table
    ```
    此命令会自动：
    - 对比 schema 差异。
    - 在 `migrations` 目录下生成新的 SQL 文件。
    - 在开发数据库中执行该 SQL。
    - 重新生成 Prisma Client (TypeScript 类型)。

### 3.3 生产环境部署 (Production)

在生产环境中，**绝对不要** 运行 `migrate dev`。应使用以下命令安全更新结构：

```bash
npx prisma migrate deploy
```

- **安全机制**: 此命令只执行 `migrations` 文件夹中尚未运行的 SQL 文件。
- **数据保护**: 它不会重置数据库，也不会清空现有数据。如果 SQL 与现有数据冲突，它会报错停止，确保数据安全。

### 3.4 数据填充 (Seeding)

初始化数据库基础数据（如管理员账号、默认配置）：

```bash
npx prisma db seed
```

- 该命令运行 `prisma/seed.ts` 脚本。
- 脚本通常使用 `upsert` (有则更新，无则创建) 逻辑，确保**幂等性**（即多次运行不会产生重复数据或报错）。

## 4. 实战：如何新增一个功能模块

以新增“待办事项 (Todo)”为例：

### 第一步：设计数据库
在 `schema.prisma` 中添加模型：
```prisma
model Todo {
  id        String   @id @default(uuid())
  title     String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  @@map("todos")
}
```
运行 `npx prisma migrate dev --name init_todo`。

### 第二步：创建模块文件
1.  **Service (`todo.service.ts`)**: 实现业务逻辑（CRUD）。
    ```typescript
    @Injectable()
    export class TodoService {
      constructor(private prisma: PrismaService) {}
      async create(userId: string, title: string) {
        return this.prisma.todo.create({ data: { title, userId } });
      }
    }
    ```
2.  **Controller (`todo.controller.ts`)**: 定义 API 路由。
    ```typescript
    @UseGuards(AuthGuard('jwt'))
    @Controller('todo')
    export class TodoController {
      constructor(private service: TodoService) {}
      @Post()
      create(@Request() req, @Body('title') title: string) {
        return this.service.create(req.user.id, title);
      }
    }
    ```
3.  **Module (`todo.module.ts`)**: 注册 Service 和 Controller。

### 第三步：注册到全局
在 `app.module.ts` 的 `imports` 数组中添加 `TodoModule`。

---

> **提示**: 遇到数据库相关问题，请优先检查 `schema.prisma` 和 `migrations` 文件夹。
