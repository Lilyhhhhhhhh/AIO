# 启明星平台 - MVP版本

启明星平台是一个基于AI的学习助手，帮助学生设定学习目标(OKR)并获得基于目标的任务推荐和知识库问答。

## 核心功能

- **用户认证**：学生可以通过邮箱和密码进行注册、登录、登出
- **OKR管理**：学生可以创建和查看自己的学习目标和关键结果
- **AI知识库问答**：基于预置知识库的问答功能
- **基于OKR的任务推荐**：AI助手能根据学生的OKR推荐每日任务

## 技术栈

- **前端**: Next.js + React
- **UI库**: Tailwind CSS
- **后端即服务(BaaS)**: Supabase (用于Auth, Database, pgvector, Edge Functions)
- **LLM API**: OpenAI API

## 项目设置

### 前提条件

- Node.js 18+
- Supabase账号
- OpenAI API密钥

### 环境变量

在项目根目录创建`.env.local`文件，并填入以下内容：

```
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# OpenAI配置
OPENAI_API_KEY=你的OpenAI API密钥
```

### 数据库设置

在Supabase SQL编辑器中运行以下SQL脚本来创建必要的表和设置：

```sql
-- OKR表
CREATE TABLE public.okrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    objective TEXT NOT NULL,
    key_results JSONB, -- 存储一个JSON数组，如 [{"text": "KR1"}, {"text": "KR2"}]
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.okrs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户只能操作自己的OKR" ON public.okrs FOR ALL USING (auth.uid() = user_id);

-- 聊天记录表
CREATE TABLE public.chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT gen_random_uuid(),
    message JSONB, -- 存储 {"role": "user/assistant", "content": "..."}
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "用户只能操作自己的聊天记录" ON public.chat_history FOR ALL USING (auth.uid() = user_id);

-- 知识库向量表 (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE public.knowledge_chunks (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536) -- 向量维度取决于你的嵌入模型
);
-- RLS策略：对所有用户开放读取权限，写入权限仅限service_role
CREATE POLICY "对所有认证用户开放读取权限" ON public.knowledge_chunks FOR SELECT USING (auth.role() = 'authenticated');
```

### 知识库初始化

1. 创建`knowledge`目录并放入PDF或Markdown格式的学习资料
2. 安装Python依赖：`pip install openai supabase langchain pypdf markdown`
3. 设置环境变量：
   ```
   SUPABASE_URL=你的Supabase项目URL
   SUPABASE_KEY=你的Supabase服务角色密钥
   OPENAI_API_KEY=你的OpenAI API密钥
   ```
4. 运行初始化脚本：`python scripts/initialize_knowledge_base.py`

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 部署

项目可以部署到Vercel平台：

1. 在Vercel上创建新项目
2. 连接到项目的Git仓库
3. 配置环境变量
4. 部署

## 项目结构

```
├── public/                 # 静态资源
├── scripts/                # 脚本文件
│   └── initialize_knowledge_base.py  # 知识库初始化脚本
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API路由
│   │   ├── login/          # 登录页面
│   │   ├── register/       # 注册页面
│   │   ├── okr/            # OKR相关页面
│   │   ├── layout.js       # 根布局
│   │   └── page.js         # 主页
│   ├── components/         # React组件
│   │   └── ChatInterface.js # 聊天界面组件
│   ├── lib/                # 工具库
│   │   └── supabase.js     # Supabase客户端
│   └── styles/             # 样式文件
│       └── globals.css     # 全局样式
├── .env.local              # 环境变量
├── next.config.js          # Next.js配置
├── package.json            # 项目依赖
├── postcss.config.js       # PostCSS配置
└── tailwind.config.js      # Tailwind CSS配置
```

## 下一步计划

- 实现更高级的AI功能
- 添加教师和管理员角色
- 实现自动更新OKR进度
- 添加更多个性化设置