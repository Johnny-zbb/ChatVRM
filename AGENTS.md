# ChatVRM Agent Guidelines

本文档提供了在 ChatVRM 项目上工作的 AI 代理所需的关键信息，包括构建命令、测试程序和代码风格约定。

## 项目概述

ChatVRM 是一个基于 Next.js 的 3D 角色对话应用程序，允许用户通过浏览器与 VRM 3D 角色进行实时对话。

### 核心技术栈
- **前端框架**: Next.js 13.2.4 (React 18.2.0)
- **语言**: TypeScript 5.0.2 (严格模式)
- **样式**: Tailwind CSS 3.3.1 + Charcoal UI 主题
- **3D 渲染**: Three.js 0.149.0 + @pixiv/three-vrm 1.0.9
- **国际化**: next-intl 4.8.2 (支持英语、中文、日语)
- **AI 对话**: OpenAI API (GPT-3.5)
- **语音合成**: 阿里云通义千问 TTS API (qwen3-tts-instruct-flash-realtime)
- **语音识别**: Web Speech API (SpeechRecognition)

### 项目状态
本项目已于 2024-07-18 存档。如需进行更改，请 Fork 仓库进行开发。

## 构建和测试命令

### 开发服务器
```bash
npm run dev
```
访问应用程序: [http://localhost:3000](http://localhost:3000)

### 生产构建
```bash
npm run build
```

### 生产运行
```bash
npm run start
```

### 导出静态站点
```bash
npm run export
```

### 代码检查
```bash
npm run lint
```

### 运行测试
项目不包含专门的测试套件或自动化测试。应通过以下方式进行手动测试：
- 启动开发服务器 (`npm run dev`)
- 在浏览器中与应用程序交互
- 测试所有主要功能（语音输入/输出、角色动画、设置、语言切换）

## 代码风格指南

### 导入规范
- 使用绝对导入，`@/` 别名指向 src 目录
  - 示例: `import { Viewer } from "@/features/vrmViewer/viewer"`
- 按以下顺序分组导入:
  1. 外部包
  2. @/ 的绝对导入
  3. 相对导入
- 尽可能使用命名导入而非默认导入

### 格式化
- 使用 Prettier 配合 Tailwind CSS 配置
- 配置文件: `tailwind.config.js`
- 遵循代码库中现有的格式化模式
- 使用一致的缩进（4 个空格）
- 最大行长度: 80 字符

### TypeScript
- 启用严格模式 (`tsconfig.json`)
- 所有变量必须具有类型
- 定义对象形状时使用接口而非类型
- 使用类型别名处理联合类型和基本类型
- 不使用类型导入（例如：从不使用 `import type {}`）
- 使用 `strict: true` 配置

### 命名约定
- 变量和函数: camelCase
- 组件: PascalCase
- 常量: UPPER_CASE_SNAKE_CASE
- 类型和接口: PascalCase
- 类: PascalCase
- 文件名: kebab-case.ts 或 kebab-case.tsx

### React 组件
- 仅使用函数式组件
- 组件名称使用 PascalCase
- JSX 文件使用 .tsx 扩展名
- 保持组件专注且小型
- 使用 hooks 而非类生命周期方法
- 为可重用逻辑提取自定义 hooks
- 使用 `useCallback` 和 `useMemo` 优化性能

### 错误处理
- 对异步操作使用 try/catch 块
- 显式处理 promise 拒绝
- 抛出描述性错误消息
- 使用前验证 API 响应
- 访问属性前检查 null/undefined 值
- 永不抑制 TypeScript 错误

### 项目结构
```
src/
├── components/          # 可重用的 UI 组件
│   ├── vrmViewer.tsx   # 3D 角色查看器组件
│   ├── messageInputContainer.tsx  # 消息输入容器
│   ├── settings.tsx    # 设置面板
│   └── ...
├── features/            # 特定功能的组件和逻辑
│   ├── animation/       # 动画处理
│   ├── chat/           # 聊天功能 (OpenAI 集成)
│   ├── constants/      # 常量定义
│   ├── emoteController/ # 表情控制
│   ├── koeiromap/      # 语音合成（已弃用，保留以兼容）
│   ├── lipSync/        # 唇形同步
│   ├── messages/       # 消息处理和语音合成
│   ├── tongyi/         # 通义千问 TTS 集成
│   └── vrmViewer/      # VRM 查看器核心逻辑
├── i18n/               # 国际化配置
│   ├── config.ts       # 语言配置 (en, zh, ja)
│   └── locales/        # 翻译文件
├── lib/                # 第三方库封装
│   ├── VRMAnimation/   # VRM 动画加载
│   └── VRMLookAtSmootherLoaderPlugin/  # 视线平滑
├── pages/              # Next.js 页面
│   ├── index.tsx       # 主页面
│   └── api/            # API 路由
│       ├── chat.ts     # 聊天 API
│       └── tts.ts      # TTS API
├── styles/             # 全局样式
└── utils/              # 纯工具函数
```

### 环境变量
将 API 密钥存储在环境变量中:
- `OPEN_AI_KEY`: OpenAI 访问密钥（用于 GPT-3.5）
- `DASHSCOPE_API_KEY`: 阿里云通义千问 API 密钥（用于 TTS）
- `DASHSCOPE_API_BASE_URL`: 通义千问 API 基础 URL（可选）
- `BASE_PATH`: 应用程序基础路径（用于部署）

### API 路由
- `/api/chat`: 处理与 OpenAI 的聊天请求
- `/api/tts`: 处理语音合成请求（通义千问 TTS）

### 国际化 (i18n)
- 支持语言: 英语 (en)、中文 (zh)、日语 (ja)
- 默认语言: 英语
- 使用 next-intl 库
- 翻译文件位于 `src/i18n/locales/`
- 中间件配置: `middleware.ts` (使用 `as-needed` 前缀策略)

### 安全注意事项
- 永不在客户端代码中暴露 API 密钥
- 验证和清理所有用户输入
- 谨慎使用动态导入和 eval()
- 清理来自外部 API 的任何数据
- 避免在 localStorage 中存储敏感数据
- API 密钥直接从浏览器访问（不存储在服务器）

### 性能优化
- 优化 3D 渲染性能
- 使用 React.memo 减少不必要的重新渲染
- 对动画使用 requestAnimationFrame
- 为 API 调用实现加载状态
- 优化资源加载（VRM 模型、纹理）
- 使用 useCallback 和 useMemo 优化函数和值

### 可访问性
- 提供适当的 ARIA 标签
- 确保键盘导航正常工作
- 使用语义化 HTML 元素
- 保持足够的颜色对比度
- 支持屏幕阅读器
- 使交互元素可访问

### 关键功能实现

#### 语音输入
- 使用 Web Speech API (SpeechRecognition)
- 支持多语言语音识别
- 在 `messageInputContainer.tsx` 中实现

#### AI 对话
- 使用 OpenAI Chat API (GPT-3.5)
- 流式响应处理
- 支持自定义系统提示词
- 在 `features/chat/openAiChat.ts` 中实现

#### 语音合成
- 主要使用阿里云通义千问 TTS API
- 模型: qwen3-tts-instruct-flash-realtime
- 支持中文语音合成
- 在 `features/tongyi/tts.ts` 中实现

#### 3D 角色渲染
- 使用 @pixiv/three-vrm 库
- 支持 VRM 文件导入
- 自动表情和视线控制
- 唇形同步功能
- 在 `features/vrmViewer/` 中实现

#### 消息处理
- 流式文本处理
- 逐句语音合成
- 情感标签解析（如 `[happy]`）
- 在 `features/messages/messages.ts` 中实现

### 开发工作流

1. **分支管理**
   - 使用 git 进行版本控制
   - 在开始新功能前创建分支
   - 提交前运行 `npm run lint`

2. **代码审查**
   - 遵循现有代码风格
   - 确保类型安全
   - 添加适当的错误处理

3. **测试**
   - 手动测试所有功能
   - 测试多语言支持
   - 测试 VRM 模型加载
   - 测试语音输入/输出

4. **部署**
   - 使用 `npm run build` 构建生产版本
   - 支持静态站点导出 (`npm run export`)
   - 配置 BASE_PATH 环境变量用于自定义部署路径

### 相关项目
- [local-chat-vrm](https://github.com/pixiv/local-chat-vrm): 浏览器本地运行的聊天应用（仅支持英语）

### 技术资源
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)
- [ChatGPT API](https://platform.openai.com/docs/api-reference/chat)
- [通义千问 TTS](https://www.aliyun.com/product/dashscope)
- [Web Speech API](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition)

---

最后更新: 2026-02-12