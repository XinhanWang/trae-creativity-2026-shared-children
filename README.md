# 共享儿女 · 暖陪伴计划

> TRAE AI 创造力大赛作品 · 社会服务赛道 · 作者：王心瀚

## 项目简介

**共享儿女 · 暖陪伴计划** 是面向中国 1.18 亿独居/空巢老人的"一站式银发陪伴平台"，参考美国 [Papa（Y Combinator 2018 夏季批次）](https://www.ycombinator.com/companies/papa) 的"Family on Demand"模式，结合中国本土志愿者池（1.7 亿大学生 + 1.5 亿低龄退休老人）与政企协同优势，将"陪伴"从奢侈品变成普惠品。

## 在线预览

🌐 **GitHub Pages**: [https://xinhanwang.github.io/trae-creativity-2026-shared-children/](https://xinhanwang.github.io/trae-creativity-2026-shared-children/)

## 核心亮点

- **三大用户**：暖家（银发家庭）+ 暖伴（青年志愿者）+ 暖社区（街道/工会/医院）
- **三类服务**：日常陪伴 · 跑腿代办 · 数字帮扶
- **B2B2C 模式**：企业工会 / 保险公司 / 街道民政作为付费方，老人家庭几乎免费
- **安全保障**：实名 + 公安背调 + 双向评价 + 服务全程录音定位 + 意外险
- **完整 Demo**：小程序端 + Web 调度后台 + 创意方案，所有按钮均可交互
- **动画系统**：滚动揭示动画、数字计数器、波纹交互、模态框过渡、Toast 滑入等微交互

## 项目结构

```
.
├── index.html                          # GitHub Pages 入口（重定向至 shared-children-warm/pages/index.html）
├── shared-children-warm/
│   ├── pages/
│   │   ├── index.html                  # 首页（Hero + 统计 + 服务流程 + 安全保障 + 用户故事）
│   │   ├── mini-program.html           # 微信小程序 Demo（暖家/暖伴双端）
│   │   ├── proposal.html               # 创意方案（10 章节 + ECharts 图表）
│   │   └── web-admin.html              # Web 调度后台（6 大模块）
│   ├── assets/
│   │   ├── hero-warm-companion.jpg     # 首页 Hero 配图
│   │   ├── scenario-park-walk.jpg      # 场景配图
│   │   └── scenario-errand-pharmacy.jpg
│   ├── colors_and_type.css             # 设计系统
│   ├── generation-tree.json            # 生成记录
│   └── orchestration-summary.json      # 编排摘要
└── shared/
    ├── css/
    │   └── animations.css              # 共享动画系统（滚动揭示、波纹、模态框、Toast 等）
    ├── js/
    │   ├── common.js                   # 共享 JS（滚动进度条、计数器、波纹效果、导航高亮）
    │   ├── echarts.min.js              # ECharts 离线库
    │   └── mermaid.min.js              # Mermaid 离线库
    └── fonts/                          # 自托管字体（50+ 字重）
```

## 功能模块

### 首页 (`shared-children-warm/pages/index.html`)
- Hero 展示 + 统计数据（数字递增动画）+ 双端入口卡片 + 六大核心服务介绍
- **服务流程**：四步开启温暖陪伴（注册认证 → 发布需求 → 智能匹配 → 温暖陪伴）
- **安全保障**：五重安全保障（实名背调、全程定位、录音留痕、意外保险、双向评价）
- **用户故事**：来自暖家、暖伴、街道民政的三方真实声音
- 滚动进度条、返回顶部按钮、响应式设计

### 小程序 Demo (`shared-children-warm/pages/mini-program.html`)
- **暖家模式**：服务下单（日常陪伴/跑腿代办/数字辅导）、一键报警、健康档案管理、个人中心、订单查看
- **暖伴模式**：接单、收入统计、服务记录、培训课程
- 角色切换动画、Tab 切换过渡、模态框动画、波纹交互、Toast 滑入
- 所有数据通过 localStorage 持久化，与调度后台数据联动

### Web 调度后台 (`shared-children-warm/pages/web-admin.html`)
- **数据概览**：实时统计卡片（hover 上浮动画）+ 订单趋势/服务类型/时间热力图
- **订单管理**：状态筛选、搜索、详情查看、暖伴指派
- **暖伴管理**：志愿者列表、详情查看
- **安全监控**：报警事件处理
- **数据分析**：月度趋势、街道覆盖、志愿者排行、年龄分布
- **B端采购**：合同管理、新建合同
- 侧边栏切换动画、列表入场动画、模态框过渡

### 创意方案 (`shared-children-warm/pages/proposal.html`)
- 10 章节完整方案 + 5 张 ECharts 图表 + 竞品对比表 + 典型场景
- 目录导航、阅读进度条、返回顶部、打印/导出 PDF、分享
- 章节滚动揭示动画、数字动画计数器、章节高亮跟随

## 动画系统

项目内置完整的动画系统（`shared/css/animations.css` + `shared/js/common.js`）：

| 动画类型 | 说明 |
|---------|------|
| 滚动揭示 | 元素进入视口时淡入上移（reveal/reveal-left/reveal-right/reveal-scale） |
| 数字计数器 | 统计数字从 0 递增到目标值（counter data-target） |
| 波纹效果 | 按钮点击产生水波纹扩散（ripple-btn） |
| 卡片悬浮 | 鼠标悬停时卡片上浮增强阴影（card-lift） |
| 模态框过渡 | 模态框淡入 + 内容上滑缩放（modal-overlay/content-animate） |
| Toast 动画 | 通知从右侧滑入（toast-animate） |
| Tab 切换 | 标签页内容淡入上移（tab-content-animate） |
| 浮动动画 | 图标持续上下浮动（float-animate） |
| 骨架屏 | 加载中骨架屏 shimmer 效果（skeleton） |
| 滚动进度条 | 顶部显示阅读进度 |
| 返回顶部 | 滚动超过 400px 后显示返回顶部按钮 |

## 数据可视化

方案包含 5 张 ECharts 图表（人口趋势、银发经济规模、需求分布、收入预测、三年里程碑）+ 1 张 Mermaid 服务闭环流程图，全部离线资源，零外部依赖。

## 本地预览

```bash
# 进入项目目录
cd trae-creativity-2026-shared-children

# 启动本地服务器（任选其一）
python -m http.server 8000
# 或
npx serve .
```

打开浏览器访问 `http://localhost:8000/`

## 技术栈

- HTML / CSS（Tailwind CSS CDN + 原生 CSS 变量设计系统）
- ECharts 5（数据可视化）
- Chart.js 4（调度后台图表）
- Lucide Icons（图标库）
- localStorage（前端数据持久化，无后端依赖）
- IntersectionObserver（滚动触发动画）
- 自托管字体（50+ 字重，零外部字体依赖）
- 原创 AI 配图

## 许可

MIT License
