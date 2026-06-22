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

## 项目结构

```
.
├── index.html                  # GitHub Pages 入口
├── shared-children-papa-cn.html # 完整创意方案 (10 章节)
├── assets/
│   ├── charts.js               # ECharts 数据图表
│   ├── cover_1280x720.jpg      # 封面图
│   ├── scenario_companion_*.jpg
│   └── scenario_errand_*.jpg
└── _shared/
    ├── js/                     # ECharts + Mermaid 离线库
    └── fonts/                  # 自托管字体
```

## 数据可视化

方案包含 5 张 ECharts 图表（人口趋势、银发经济规模、需求分布、收入预测、三年里程碑）+ 1 张 Mermaid 服务闭环流程图，全部离线资源，零外部依赖。

## 本地预览

```bash
# 进入项目目录
cd shared-children-papa-cn

# 启动本地服务器（任选其一）
python -m http.server 8000
# 或
npx serve .
```

打开浏览器访问 `http://localhost:8000/shared-children-papa-cn.html`

## 技术栈

- HTML / CSS（原生，无框架）
- ECharts 5（数据可视化）
- Mermaid（流程图）
- 自托管字体（WorkSans + InstrumentSerif + JetBrainsMono）
- 3 张原创 AI 配图

## 许可

MIT License
