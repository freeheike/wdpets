# WebPet · 网页治愈系虚拟宠物

一只住在网页里的治愈系小宠物 — 养成、陪伴、专注、可嵌入任何网站。

## 功能特性 (MVP v1.0)

- **网页桌宠模式** — 拖拽、点击互动、长时间不动自动睡觉、Lv.5 解锁跟随鼠标
- **养成系统** — 饥饿值、心情值、清洁值、经验值、等级、金币
- **每日签到** — 获得金币，连续签到有加成
- **皮肤商店** — 5 款基础皮肤，金币购买
- **专注陪伴** — 25 分钟番茄钟，完成获得经验和金币
- **分享卡片** — 生成图片保存或复制文案分享
- **网站嵌入插件** — 一行代码把宠物挂到自己的网站
- **用户系统** — 游客模式 / 本地登录 / Supabase 云同步（可选）

## 快速开始

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

打开浏览器访问 http://localhost:5173

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 样式 | Tailwind CSS 4 |
| 状态管理 | Zustand |
| 路由 | React Router 7 |
| 分享图片 | html2canvas |
| 后端（可选） | Supabase |
| 部署 | Vercel / Cloudflare Pages / Netlify |

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── Pet/          # 桌宠核心（CSS 动画）
│   ├── StatsBar.tsx    # 状态面板
│   ├── ActionPanel.tsx # 互动按钮
│   ├── SkinShop.tsx    # 皮肤商店
│   ├── FocusMode.tsx   # 专注模式
│   ├── ShareCard.tsx   # 分享卡片
│   ├── EmbedCode.tsx   # 嵌入代码
│   └── AuthModal.tsx   # 登录注册
├── pages/            # 页面路由
├── store/            # Zustand 状态
├── lib/              # 工具库
└── types/            # 类型定义
public/
└── widget.js         # 网站嵌入插件
```

## 配置 Supabase（可选）

1. 在 [Supabase](https://supabase.com) 创建项目
2. 复制 `.env.example` 为 `.env`
3. 填入 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
4. 重启开发服务器

不配置 Supabase 时，项目以**本地游客模式**运行，数据保存在浏览器 localStorage 中。

## 嵌入插件使用

在你的网页 `</body>` 前添加：

```html
<script src="https://your-domain.com/widget.js"
  data-pet-name="小团子"
  data-skin="default"
  data-level="5">
</script>
```

## 部署

### Vercel

```bash
npm run build
npx vercel
```

### Cloudflare Pages

```bash
npm run build
# 将 dist/ 目录部署到 Cloudflare Pages
```

## 商业模式路线图

| 阶段 | 变现方式 |
|------|----------|
| MVP 测试 | 皮肤金币购买（已实现基础版） |
| v1.1 | 会员订阅（多宠物、云存档、无广告） |
| v1.2 | 皮肤付费（支付宝/微信/Stripe） |
| v1.3 | 网页插件商业版（商家定制） |
| v2.0 | 品牌定制宠物 |

## License

MIT
