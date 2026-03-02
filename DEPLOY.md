# 腾讯云 EdgeOne Pages 部署说明

## 构建产物

- **输出目录**: `out/`
- **构建命令**: `npm run build`
- Next.js 已配置 `output: "export"`，构建后生成纯静态站点，可直接部署到 EdgeOne Pages。

## 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 构建

```bash
npm run build
```

构建完成后，`out/` 目录即为可部署的静态文件。

> **提示**：若 Turbopack 构建遇到网络或字体问题，项目已默认使用 `--webpack` 构建。

### 3. 上传到腾讯云 EdgeOne Pages

1. 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入 **站点管理** → 选择站点 → **Pages 页面托管**
3. 新建页面或选择已有页面
4. **构建产物目录** 选择或填写 `out`
5. 部署方式可选：
   - **本地上传**：将 `out` 目录内容打包为 zip，在控制台上传
   - **Git 关联**：关联 Git 仓库，构建命令填写 `npm run build`，输出目录填写 `out`

### 4. 媒体资源（可选）

如需将图片/视频迁移至腾讯云 COS / VOD 以加速国内访问：

1. 将 `public/projects/`、`public/videos/` 下的媒体文件上传至 COS / VOD
2. 在项目根目录创建 `.env.production`（或构建时注入环境变量）：

   ```
   NEXT_PUBLIC_IMAGE_BASE_URL=https://你的COS桶.cos.xxx.myqcloud.com
   NEXT_PUBLIC_VIDEO_BASE_URL=https://你的VOD播放域名
   ```

3. 重新执行 `npm run build` 后部署

## 目录结构（构建后）

```
out/
├── index.html          # 首页
├── 404.html            # 404 页
├── _not-found.html     # 未找到页
├── avatar.jpg          # 头像等 public 静态资源
├── projects/           # 项目图片（若保留在 public）
├── videos/             # 视频文件（若保留在 public）
├── workflows/          # 工作流 JSON
└── _next/              # Next.js 静态资源
    ├── static/
    └── ...
```

## 注意事项

- 本网站为单页应用，路由仅 `index.html`，刷新不会出现 404（根路径由 EdgeOne 映射）
- 若部署到子路径（如 `https://xxx.com/portfolio/`），需在 `next.config.ts` 中设置 `basePath: "/portfolio"`
- `.env.local` 中的敏感信息（如 OSS 密钥）请勿提交到 Git，仅用于本地开发
