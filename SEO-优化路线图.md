# PrintWeekly SEO 优化路线图

> 创建日期：2026-09-03
> 目标：让 printweekly.top 从 0 流量 → 稳定日 UV 50+，核心关键词进入 Google 前 10

---

## 一、当前现状（2026-09-03）

| 指标 | 数值 | 说明 |
|---|---|---|
| 已编入索引 | 16 页 | 6 模板 + 7 博客 + 首页/关于/联系 |
| GSC 展示 | 5/24h | 极低，Google 刚发现 |
| GSC 平均排名 | 51.4 | 太靠后，几乎没人能看到 |
| GA 关键事件 | 0 | print_planner 代码已部署，**待触发验证** |
| Pinterest | 1 张 pin 已发 | Business 账号 + 网站所有权已验证 |
| 博客数量 | 7 篇 | 对比竞争对手几十到上百篇，内容量严重不足 |
| 外链数量 | 0 | Reddit/Pinterest 引流后开始累积 |
| 域名年龄 | 未知 | 可能触发 Google Sandbox（沙盒效应） |

---

## 二、已完成的技术 SEO 修复

- [x] GA4 `print_planner` 转化事件代码部署（generator.js）
- [x] 首页模板区添加 2 张新博客卡片（权重传递）
- [x] 6 篇博客底部互相添加 "Related reading" 卡片（内链网）
- [x] 博客 Article Schema 添加 `datePublished` / `dateModified`
- [x] sitemap.xml 更新至 17 条 URL 并重新提交 GSC
- [x] Pinterest 域名所有权验证（meta tag + DNS TXT 双保险）
- [x] robots.txt 配置 AI 爬虫限制

---

## 三、每周固定产出表

### 内容生产（决定长期流量的核心）

| 频率 | 事项 | 耗时 | 负责什么 |
|---|---|---|---|
| 每周 ×2 | 写博客（800-1200 字/篇） | 2 小时 | 长尾关键词排名、内链网覆盖 |
| 每周 ×2 | 做 Pinterest pin（Canva） | 10 分钟 | 长尾图搜索流量、外链 |
| 每周 ×1 | Reddit 引流帖（3 选 1） | 30 分钟 | 真实用户、外链、活跃度信号 |

### 博客选题池（按优先级排列）

| 优先级 | 标题 | 目标长尾词 | 内链回 |
|---|---|---|---|
| 1 | Weekly Planner with Habit Tracker Printable — Free Template | weekly planner with habit tracker printable | 6 篇博客 + weekly-habit-tracker-printable |
| 2 | How to Plan Your Week Effectively: The 20-Minute Sunday Routine | how to plan your week effectively | weekly-planner-vs-daily-planner + undated-weekly-planner |
| 3 | Weekly Meal Planner Printable (Free, Undated) | weekly meal planner printable | habit-tracker-ideas + undated-weekly-planner |
| 4 | A4 Weekly Planner Template Free Download | A4 weekly planner template free | 所有模板页 |
| 5 | Weekly Planner for Students — The Only Tool You Need This Semester | weekly planner for students | best-weekly-planner-for-students |
| 6 | How to Use a Vertical Weekly Planner (Pros + Cons) | vertical weekly planner | vertical-weekly-planner + how-to-use-a-weekly-planner |
| 7 | Cute Weekly Planner Printable for Kids — Free PDF | cute weekly planner printable | cute-weekly-planner-template |
| 8 | Weekly Goal Planner Printable — Set 3 Goals Every Week | weekly goal planner printable | undated-weekly-planner |

### Pinterest Pin 覆盖表

| Pin # | 目标模板页 | 视觉风格 | 目标长尾词 |
|---|---|---|---|
| 1 | undated-weekly-planner | 薄荷绿简约 flat lay | Free Undated Weekly Planner Printable |
| 2 | cute-weekly-planner-template | 粉彩可爱 flat lay | Cute Pastel Weekly Planner Printable |
| 3 | vertical-weekly-planner | 木桌生活 flat lay | Vertical Weekly Planner Printable |
| 4 | weekly-habit-tracker-printable | 极简白纸 + 钢笔 | Weekly Habit Tracker Printable |
| 5 | 7-day-weekly-planner-pdf | 打印 A4 纸 + 咖啡 | 7 Day Weekly Planner PDF |
| 6 | 博客 habit-tracker-ideas | 习惯追踪条特写 | Habit Tracker Ideas |
| 7 | 博客 undated-planner-vs-dated-planner | 两页对比图 | Undated vs Dated Planner |
| 8 | 博客 weekly-planner-vs-daily-planner | 两页对比图 | Weekly vs Daily Planner |

### Reddit 引流话术库

**固定结构（防止被当广告秒删）：**
1. 开场白："I've been lurking here for a while and wanted to share something I built."
2. 核心痛点：说你自己遇到的问题（"couldn't find a non-dated planner"）
3. 解决方案："So I built one."（只说功能，不说"快来用我的网站"）
4. 链接：放在正文底部，加粗
5. 提问收尾：引导讨论（"Curious what your experiences have been!"）

**话术版本库：**

| Subreddit | 标题模板 | 链接指向 |
|---|---|---|
| r/productivity | "I built a free printable weekly planner generator because I couldn't find one that wasn't dated" | https://printweekly.top |
| r/planning | "Undated vs dated planners — I wrote a comparison + built a free printable generator" | https://printweekly.top/blog/undated-planner-vs-dated-planner |
| r/bulletjournal | "Free undated weekly planner printable — customizable, no signup" | https://printweekly.top/undated-weekly-planner |
| r/handwriting | "Printable weekly planner for handwriters — undated so you fill in dates yourself" | https://printweekly.top/undated-weekly-planner |

**发帖前必做：** 每个 subreddit 先刷 5 分钟，点赞/评论 3-5 个帖子。发帖后自己用小号在评论区说一句"Just tried it, works great"。

---

## 四、每周数据检查表

### GA（Google Analytics 4）

| 看什么 | 路径 | 关注 |
|---|---|---|
| print_planner 关键事件数 | 报告 → 参与度 → 事件 | > 0 = 追踪正常工作 |
| 新用户 vs 回访用户 | 报告 → 受众概览 | 回访 > 15% = 有留存 |
| 流量来源 | 报告 → 获取方式 → 流量获取 | 看到 Pinterest / Reddit 带来流量 |
| 打印事件按模板分布 | 报告 → 参与度 → 事件 → print_planner → 按 template_style 细分 | 知道哪个模板最受欢迎 |

### GSC（Google Search Console）

| 看什么 | 路径 | 关注 |
|---|---|---|
| 博客排名趋势 | 效果 → 过去 28 天 → 按查询 → 位置排序 | 4 篇新博客是否从 50+ 进 30+ |
| 博客展示量 | 效果 → 过去 28 天 → 按网页 | 是否 > 50（表示 Google 开始给流量） |
| 内部链接数量 | 链接数量 → 内部链接 | 博客之间应该各有 3-5 条内链 |
| 索引覆盖 | 编制索引 → 网页 → 过去 24h | 所有页面都应该是"已编入索引" |

### Pinterest Analytics

| 看什么 | 路径 | 关注 |
|---|---|---|
| Pin 曝光量 | 分析 → 概览 → Pin | 每周稳步增长 |
| 从 Pinterest 跳转的网站访问量 | 分析 → 概览 → 网站活动 | 与 GA 数据交叉验证 |
| 表现最好的 Pin | 分析 → 内容 → Top Pins | 知道哪种风格的图最受欢迎 |

---

## 五、时间里程碑预测

| 时间 | 标志 | 数据目标 |
|---|---|---|
| **2 周后** | 排名开始松动 | 部分博客从 50+ → 30-40 位；GSC 日展示 50+ |
| **1 个月后** | 第一波流量 | GSC 日点击 5-10；GA print_planner 事件开始出现 |
| **3 个月后** | 稳定流量 | 博客量 ~20 篇；多个长尾词进前 15；日 UV 10-30 |
| **6 个月后** | 小有所成 | 博客量 ~35 篇；核心关键词进前 5；日 UV 50-100；回访率 > 20% |
| **12 个月后** | 起飞 | 博客量 ~60 篇；形成长尾词集群；日 UV 200+ |

---

## 六、临时解决办法（网站被拦截时）

### Pinterest 拦截 printweekly.top

- 解法：用 https://bit.ly 或 https://t.ly 生成短链
- 把短链替换 pin 里的目标链接

### Google Sandbox（沙盒效应）

- 现象：新域名排名长期被压在 30+ 位以下
- 解决：持续输出内容 + 积累外链，通常 3-6 个月自动解除
- 主动加速：Reddit 发帖 + Pinterest pin 带来真实用户信号

### GA print_planner 事件不出现

1. 确认 generator.js 线上版本包含 gtag('event', 'print_planner', ...)
2. 打开 https://printweekly.top/undated-weekly-planner → F12 → Console → 手动执行：
   ```
   gtag('event', 'print_planner', { 'test': 'manual_trigger' })
   ```
3. 等 1 分钟刷新 GA 近期事件页

---

## 七、快速操作清单（今天要做）

- [ ] 打开 https://printweekly.top/undated-weekly-planner → 点 Print / Save as PDF → 关对话框
- [ ] 刷新 GA → 近期事件 → 找 print_planner → 点 ⭐ 标记关键事件
- [ ] 写第 1 篇新博客（Weekly Planner with Habit Tracker Printable）
- [ ] 发帖到 r/productivity

---

## 八、SEO 基础术语速查

| 术语 | 解释 |
|---|---|
| SERP | 搜索引擎结果页（Search Engine Results Page） |
| CTR | 点击率（Click-Through Rate）= 点击数 / 展示数 |
| DA | Domain Authority 域名权威度，Moz 评分 1-100 |
| Sandbox | Google 对新域名的临时"试用期"，排名被刻意压后 |
| On-page SEO | 页面内优化（title、description、Schema、内链） |
| Off-page SEO | 页面外优化（外链、社交媒体分享） |
| Crawl | Google 爬虫访问你的网站 |
| Index | Google 把你的页面存入搜索数据库 |
| Ranking | 你的页面在 SERP 上的位置 |
| Sandbox Effect | Google 对新域名的延迟排名机制 |

---

> **核心公式：流量 = 内容量 × 渠道数 × 坚持时间**
> 
> 内容不够 + 渠道不够 × 时间不够 = 流量不够。现在内容量是最大瓶颈。
