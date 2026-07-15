# 共享儿女 · 暖陪伴计划

> TRAE AI 创造力大赛作品 · 社会服务赛道 · 作者：王心瀚

1.18 亿独居老人，不该独自面对漫长的下午。

**共享儿女**是一个面向中国银发家庭的"陪伴即服务"平台原型。参考美国 Papa 的 Family on Demand 模式，将大学生与低龄退休老人转化为可调度、可信任的"暖伴"志愿者池，通过 B2B2C 架构让企业工会、保险公司、街道民政成为付费方，老人家庭几乎零成本获得陪伴服务。

所有页面均为纯前端实现，无后端依赖，数据通过 localStorage 持久化并在三端实时联动。

## 在线预览

| 页面 | 地址 |
|------|------|
| 首页 | https://wangxinhan.cn/trae-creativity-2026-shared-children/shared-children-warm/pages/index.html |
| 小程序 Demo | https://wangxinhan.cn/trae-creativity-2026-shared-children/shared-children-warm/pages/mini-program.html |
| Web 调度后台 | https://wangxinhan.cn/trae-creativity-2026-shared-children/shared-children-warm/pages/web-admin.html |
| 创意方案 | https://wangxinhan.cn/trae-creativity-2026-shared-children/shared-children-warm/pages/proposal.html |

GitHub 仓库：https://github.com/XinhanWang/trae-creativity-2026-shared-children

## 三端架构

整个 Demo 由四个页面构成，共享同一套数据层（`shared/js/demo-store.js`），形成"老人家庭 — 志愿者 — 调度平台 — 方案展示"的完整闭环。

### 小程序 Demo（暖家 + 暖伴双端）

模拟微信小程序环境，通过顶部按钮在两个角色视角间切换。

**暖家模式**面向老人家庭：
- 三类服务下单：日常陪伴、跑腿代办、数字辅导
- 一键报警，触发后台安全监控告警
- 健康档案管理（血压、用药、体检记录）
- 附近地图（百度地图 JSAPI，标注附近暖伴位置）
- 订单列表与状态追踪

**暖伴模式**面向志愿者：
- 接单大厅，按技能匹配可接订单
- 收入统计与服务记录
- 实名认证流程（未认证/待审核/已认证/已拒绝四态流转）
- 培训课程入口

两端的订单、认证、报警数据通过 localStorage 实时同步——在小程序端创建的订单会立即出现在 Web 调度后台的订单管理列表中。

### Web 调度后台

六大功能模块，模拟运营人员的日常工作台：

- **数据概览**：统计卡片 + 订单趋势折线图（Chart.js，支持 7/30 天切换）+ 服务类型分布 + 时间热力图
- **订单管理**：状态筛选、搜索、详情查看、暖伴指派（校验在线状态、认证状态、技能匹配）
- **暖伴管理**：志愿者列表、认证审核、详情查看
- **安全监控**：报警事件实时看板 + 百度地图标注报警位置
- **数据分析**：月度趋势、街道覆盖、志愿者排行、年龄分布
- **B 端采购**：合同管理、新建合同（面向企业工会/保险公司/街道民政）

### 首页

项目门面，包含 Hero 区、统计数字递增动画、双端入口卡片、六步服务流程、五重安全保障（实名背调、全程定位、录音留痕、意外保险、双向评价）、三方用户故事。

### 创意方案

10 章节完整商业方案，内含 5 张 ECharts 图表（人口趋势、银发经济规模、需求分布、收入预测、三年里程碑）和 1 张 Mermaid 服务闭环流程图。支持目录导航、阅读进度条、打印导出 PDF。

## 技术实现

### 前端架构

零构建工具，零 npm 依赖，纯静态 HTML/CSS/JS。每个页面自包含，可离线运行。

```
.
├── index.html                              # GitHub Pages 入口（重定向至首页）
├── shared-children-warm/
│   ├── pages/
│   │   ├── index.html                      # 首页
│   │   ├── mini-program.html               # 小程序 Demo
│   │   ├── web-admin.html                  # Web 调度后台
│   │   └── proposal.html                   # 创意方案
│   ├── assets/                             # 原创 AI 配图
│   └── colors_and_type.css                 # 设计系统定义
└── shared/
    ├── css/
    │   ├── app.css                         # Tailwind CSS v4 编译产物
    │   └── animations.css                  # 动画系统
    ├── js/
    │   ├── demo-store.js                   # 统一数据层（schema 迁移 + 种子数据）
    │   ├── baidu-map-loader.js             # 百度地图加载器（静态优先 + 动态后备）
    │   ├── common.js                       # 共享交互（滚动揭示、计数器、波纹）
    │   ├── chart.umd.js                    # Chart.js 离线
    │   ├── echarts.min.js                  # ECharts 离线
    │   ├── lucide.min.js                   # Lucide 图标离线
    │   └── mermaid.min.js                  # Mermaid 离线
    └── fonts/                              # 自托管字体（50+ 字重）
```

### 数据层

`shared/js/demo-store.js` 是三端共享的统一数据层，负责：

- **Schema 版本迁移**：当前 `sc_schema_version = 11`，低版本数据自动补全字段而非覆盖
- **种子数据初始化**：首次访问时写入演示订单、暖伴、认证记录、合同等
- **订单状态机**：七态流转（待接单 → 待服务 → 进行中 → 待确认 → 已完成 / 已取消 / 已过期），指派校验在线状态、认证状态、技能匹配
- **暖伴关联**：使用 `volunteerId`（如 V-001）作为稳定主键，不依赖可变的姓名
- **时间处理**：报警时间存储为数值 `createdAt`，格式化通过 `fmtAlarmTime()`；预约时间向上取整到 10 分钟
- **安全输出**：所有用户可编辑字段通过 `escapeHtml()` 转义后插入 DOM

### 地图方案

百度地图 JSAPI v3.0，采用静态 `<script>` 标签直接加载（兼容 Edge 跟踪防护），`baidu-map-loader.js` 作为动态加载后备方案。地图加载失败时降级为内联 SVG 示意图，并提供"重试加载"按钮。

小程序端展示三类地图：
- 附近地图（首页，标注暖伴位置）
- 选址地图（下单页，点击选点 + 地址搜索联想）
- 详情地图（订单详情，标注服务地址）

### 设计系统

暖色调 CSS 变量系统，主色 `#D4654A`（赤陶），背景 `#FDF9F5`（暖白）。字体使用 Noto Sans SC / Noto Serif SC，手机模拟器内通过 `--font-scale` 变量支持字号缩放。Tailwind CSS v4 预编译为 `app.css`，无需 CDN。

### 动画系统

`shared/css/animations.css` + `shared/js/common.js` 提供 11 种微交互：滚动揭示（reveal/reveal-left/reveal-right/reveal-scale）、数字计数器、波纹效果、卡片悬浮、模态框过渡、Toast 滑入、Tab 切换、浮动图标、骨架屏、滚动进度条、返回顶部。全部基于 IntersectionObserver，尊重 `prefers-reduced-motion`。

## 本地运行

```bash
cd trae-creativity-2026-shared-children

# 任选一种方式启动静态服务器
python -m http.server 8000
# 或
npx serve .
```

浏览器访问 `http://localhost:8000/`

调度后台登录凭据：用户名 `admin`，密码 `123456`。

## 技术栈

| 类别 | 技术 |
|------|------|
| 样式 | Tailwind CSS v4（预编译）+ CSS 变量设计系统 |
| 图表 | ECharts 5、Chart.js 4 |
| 地图 | 百度地图 JavaScript API v3.0 |
| 图标 | Lucide Icons |
| 数据 | localStorage（schema 版本化迁移） |
| 动画 | IntersectionObserver + CSS transitions |
| 字体 | 自托管（50+ 字重，零外部字体依赖） |

## 许可

MIT License
