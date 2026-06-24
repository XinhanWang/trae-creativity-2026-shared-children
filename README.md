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

## 项目结构

```
.
├── index.html                    # GitHub Pages 入口（重定向至 pages/index.html）
├── pages/
│   ├── index.html                # 首页（Hero + 功能导航）
│   ├── mini-program.html         # 微信小程序 Demo（暖家/暖伴双端）
│   ├── proposal.html             # 创意方案（10 章节 + ECharts 图表）
│   └── web-admin.html            # Web 调度后台（6 大模块）
├── shared-children-papa-cn.html  # 原始创意方案（存档）
├── assets/
│   ├── charts.js                 # ECharts 数据图表
│   ├── cover_1280x720.jpg        # 封面图
│   ├── hero-warm-companion.jpg   # 首页 Hero 配图
│   ├── scenario-park-walk.jpg    # 场景配图
│   └── scenario-errand-pharmacy.jpg
└── shared/
    ├── js/                       # ECharts + Mermaid 离线库
    └── fonts/                    # 自托管字体
```

## 功能模块

### 首页 (`pages/index.html`)
- Hero 展示 + 统计数据 + 双端入口卡片 + 六大核心服务介绍
- 响应式设计，支持移动端菜单

### 小程序 Demo (`pages/mini-program.html`)
- **暖家模式**：服务下单（日常陪伴/跑腿代办/数字辅导）、一键报警、健康档案管理、个人中心、订单查看
- **暖伴模式**：接单、收入统计、服务记录、培训课程
- 所有数据通过 localStorage 持久化，与调度后台数据联动

### Web 调度后台 (`pages/web-admin.html`)
- **数据概览**：实时统计卡片 + 订单趋势/服务类型/时间热力图
- **订单管理**：状态筛选、搜索、详情查看、暖伴指派
- **暖伴管理**：志愿者列表、详情查看
- **安全监控**：报警事件处理
- **数据分析**：月度趋势、街道覆盖、志愿者排行、年龄分布
- **B端采购**：合同管理、新建合同

### 创意方案 (`pages/proposal.html`)
- 10 章节完整方案 + 5 张 ECharts 图表 + 竞品对比表 + 典型场景
- 目录导航、阅读进度条、返回顶部、打印/导出 PDF、分享
- 数字动画计数器、章节高亮跟随

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
- 自托管字体（WorkSans + InstrumentSerif + JetBrainsMono）
- 原创 AI 配图

## 许可

MIT License
