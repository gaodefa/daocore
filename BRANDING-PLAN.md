# OpenClaw → DaoCore 品牌重塑计划

> 基于开源项目 OpenClaw 进行二次开发，打造自有品牌产品 **DaoCore**。

---

## 品牌标识映射

| 项目 | 当前值 | 新值 |
|------|--------|------|
| 产品名 | OpenClaw | **DaoCore** |
| Logo | 🦞 龙虾 | ☯️ 太极（taiji-logo.svg） |
| 品牌色 | 珊瑚红 #ff4d4d | 保留（logo 沿用此配色） |
| CLI 命令 | `openclaw` | **待定**（见下方说明） |
| 安装命令 | `npm i -g openclaw` | 见各节 |

---

## 一、官网前端 (openclaw.ai)

### 1.1 布局/导航 — 名字 + Logo 替换

| 文件 | 行/位置 | 当前 | 改为 |
|------|---------|------|------|
| `openclaw.ai/src/components/SiteTopbar.astro` | 16 | `src="/favicon.svg"` | 指向 taiji-logo.svg（或派生版） |
| 同上 | 17 | `<span>OpenClaw</span>` | `<span>DaoCore</span>` |
| 同上 | 19 | `aria-label="OpenClaw home"` | `aria-label="DaoCore home"` |
| 同上 | 28 | `href="https://docs.openclaw.ai/"` | 你的 docs 域名 |
| 同上 | 30 | `href="https://github.com/openclaw/openclaw"` | 你的仓库 |

### 1.2 全局布局 — Meta / OG

| 文件 | 当前 | 改为 |
|------|------|------|
| `openclaw.ai/src/layouts/Layout.astro:6-8` | `"OpenClaw — The AI that actually does things."` | `"DaoCore — ..."` |
| 同上:9 | `Astro.site ?? "https://openclaw.ai"` | 新域名 |
| 同上:22 | `<link ... title="OpenClaw Blog"` | `DaoCore Blog` |
| 同上:28 | `og:image → https://openclaw.ai/og-image.png` | 新域名 + 新 OG 图 |
| 同上:34 | `twitter:image` 同上 | 同上 |
| 同上:47-52 | CSS 变量中的品牌色 | 根据需求调整 |

### 1.3 首页 — Hero + 安装命令

| 文件 | 具体改动 |
|------|---------|
| `openclaw.ai/src/pages/index.astro` | 页面 title prop |
| 同上 | **龙虾 SVG 图标**（81-102行）→ 替换为 taiji-logo.svg（可缩放适配后内联或引用） |
| 同上 | `<span class="title-main">OpenClaw</span>` → `DaoCore` |
| 同上 | One-liner 安装 URL：`https://openclaw.ai/install.sh` → 新域名 |
| 同上 | `npm i -g openclaw` → 见下方的安装命令说明 |
| 同上 | `openclaw onboard` → 同上 |
| 同上 | Hackable: `git clone https://github.com/openclaw/openclaw.git` → 你的仓库 |
| 同上 | macOS 下载链接 → 你的发布页 |
| 同上 | 内联 JS 中的安装命令字符串 |


### 1.4 公开资产

| 资产 | 操作 |
|------|------|
| `openclaw.ai/public/favicon.svg` | 用 `taiji-logo.svg` 替换（SVG 格式天然兼容） |
| `openclaw.ai/public/favicon-32.png` | 从 taiji-logo.svg 导出 32x32 PNG |
| `openclaw.ai/public/cat.ico` | 导出 ICO |
| `openclaw.ai/public/logo.png` | 导出品牌 Logo PNG |
| `openclaw.ai/public/apple-touch-icon.png` | 导出 180x180 PNG |
| `openclaw.ai/public/og-image.png` | 设计附带品牌名的 OG 分享图 |
| `openclaw.ai/public/og-image.svg` | 同上 SVG 版 |
| `openclaw.ai/public/openclaw-logo-text-dark.png` | 替换为 `daocore-logo-text-dark.png` |
| `openclaw.ai/public/install.sh` | ⚠️ 详见下节 |

---

## 二、终端安装品牌露出

### 2.1 安装脚本 — 输出文案替换

| 文件 | 替换模式 |
|------|---------|
| `openclaw.ai/public/install.sh` | `OpenClaw` → `DaoCore`，URL → 新域名，`DEFAULT_TAGLINE` 更新，ANSI 配色可选调 |
| `openclaw.ai/public/install.ps1` | `OpenClaw` → `DaoCore` |
| `openclaw.ai/public/install-cli.sh` | `OpenClaw` → `DaoCore` |
| `scripts/install.sh` | 同上（主仓库源文件） |
| `scripts/install.ps1` | 同上 |
| `scripts/install-cli.sh` | 同上 |

⚠️ 环境变量 `OPENCLAW_HOME`、`OPENCLAW_*`、路径 `~/.openclaw` 不动。

### 2.2 CLI Banner

| 文件 | 行 | 当前 | 改为 |
|------|-----|------|------|
| `src/cli/banner.ts` | `const title = ...` | `decorativePrefix("🦞", "OpenClaw", ...)` | `decorativePrefix("☯️", "DaoCore", ...)` |

### 2.3 CLI Tagline

| 内容 | 当前 | 改为 |
|------|------|------|
| `DEFAULT_TAGLINE` | `"All your chats, one OpenClaw."` | `"All your chats, one DaoCore."` |
| 龙虾/OpenClaw 相关 tagline | ~20 条含 🦞/lobster/claw/crab 的标语 | 替换为太极/Dao 相关隐喻（如 "道生一，一生万物" 风格，或纯英文 tagline） |

---

## 三、Web 控制 UI

| 文件 | 改动 |
|------|------|
| `ui/index.html` | `<title>OpenClaw Control</title>` → `<title>DaoCore Control</title>` |
| 同上 | `<openclaw-app>` → `<daocore-app>` |
| 同上 | CSS class `openclaw-mount-*` → `daocore-mount-*` |
| 同上 | 回退面板文案 "OpenClaw Control UI" → "DaoCore Control UI" |
| `ui/public/manifest.webmanifest` | `name: "DaoCore"`，`short_name`，icons 路径 |
| `ui/public/favicon.svg` | 替换为 taiji-logo.svg |
| `ui/public/favicon-32.png` | 替换 |
| `ui/public/favicon.ico` | 替换 |
| `ui/public/apple-touch-icon.png` | 替换 |

---

## 关于 CLI 命令名的说明

当前官网展示的安装命令示例（`openclaw onboard`、`npm i -g openclaw`）对应的是项目的 CLI 二进制名和 npm 包名。如果你希望在官网上展示 **`daocore`** 作为命令名，有两种选择：

| 方案 | 做法 | 影响 |
|------|------|------|
| **A：展示层替换** | 官网代码块中 `openclaw` 改为 `daocore`，但实际安装的仍是 `openclaw` 包。用户打 `openclaw` 命令也能用 | 命令名不一致，新用户可能困惑 |
| **B：加别名** | 保留 `openclaw` 二进制，在 `package.json` 的 `bin` 中增加 `"daocore": "openclaw.mjs"`。官网展示 `daocore`，用户两个名字都能用 | 增加一个入口别名，无兼容影响 |

**推荐方案 B**：不改动任何内部逻辑，只加一个二进制别名。用户用 `daocore` 和 `openclaw` 都可以操作，平滑过渡。

---

## 实施步骤

### Step 1 — Logo 资产准备

```
taiji-logo.svg → 按需派生：
  ├── favicon.svg（直接可用，SVG 格式）
  ├── favicon-32.png（缩放导出）
  ├── favicon.ico（缩放导出）
  ├── apple-touch-icon.png（180x180）
  ├── og-image.png + og-image.svg（+ 品牌名文字排版）
  └── logo.png（带品牌名的完整 Logo）
```

### Step 2 — 官网替换

```bash
# 品牌名全局替换
cd openclaw.ai
find src -name "*.astro" -exec sed -i 's/OpenClaw/DaoCore/g' {} +
sed -i 's/OpenClaw/DaoCore/g' README.md
sed -i 's/OpenClaw/DaoCore/g' astro.config.mjs

# Logo 资产替换
cp /Users/wangshizhen/Desktop/taiji-logo.svg public/favicon.svg
# ... + 其他导出资产

# 安装 URL 替换（按需）
sed -i 's/openclaw\.ai/daocore.ai/g' src/pages/index.astro
```

### Step 3 — 安装脚本替换

```bash
cd openclaw
sed -i 's/OpenClaw/DaoCore/g' scripts/install.sh
sed -i 's/OpenClaw/DaoCore/g' scripts/install.ps1
sed -i 's/OpenClaw/DaoCore/g' scripts/install-cli.sh
# 同样处理 openclaw.ai 中的副本
cd ../openclaw.ai
sed -i 's/OpenClaw/DaoCore/g' public/install.sh
sed -i 's/OpenClaw/DaoCore/g' public/install.ps1
sed -i 's/OpenClaw/DaoCore/g' public/install-cli.sh
```

### Step 4 — CLI Banner + Tagline

```bash
cd openclaw
# banner.ts — 改 emoji 和品牌名
sed -i 's/🦞/☯️/g' src/cli/banner.ts
sed -i 's/"OpenClaw"/"DaoCore"/g' src/cli/banner.ts
sed -i 's/OpenClaw/DaoCore/g' src/cli/tagline.ts
```

然后手动过一遍 `tagline.ts`，把含 lobster/claw/crab 梗的约 20 条替换为太极/Dao 概念的 tagline。

### Step 5 — 控制 UI

```bash
cd openclaw
sed -i 's/OpenClaw Control/DaoCore Control/g' ui/index.html
sed -i 's/openclaw-app/daocore-app/g' ui/index.html
sed -i 's/openclaw-mount-/daocore-mount-/g' ui/index.html
sed -i 's/OpenClaw/DaoCore/g' ui/public/manifest.webmanifest
```

然后把 favicon SVG/PNG/ICO 替换为 taiji-logo.svg 的派生版本。

---

## 总结

| 改动 | 文件数 | 时间预估 |
|------|--------|---------|
| 官网前端 (openclaw.ai) — 名字 + Logo + 安装命令 | ~15 个文件 | 2-3 天 |
| 终端安装品牌露出 — 安装脚本 + banner + tagline | ~8 个文件 | 1 天 |
| Web 控制 UI — Logo + 名字 | ~8 个文件 | 0.5 天 |
| **总计** | **~30 个文件** | **3-5 天** |

其中 Logo 资产准备（taiji-logo.svg → 各规格导出）和 tagline 重写是需要投入创意的部分，其余都是确定性的文本替换。
