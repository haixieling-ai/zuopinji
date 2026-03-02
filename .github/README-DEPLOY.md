# GitHub → 阿里云 OSS 自动部署

## 1. 在 GitHub 仓库添加 Secrets

仓库 → Settings → Secrets and variables → Actions → New repository secret，添加：

| Secret 名称 | 说明 |
|-------------|------|
| `OSS_ACCESS_KEY_ID` | 阿里云 AccessKey ID |
| `OSS_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret |
| `OSS_BUCKET` | OSS Bucket 名称（如 wangzhanxie） |
| `OSS_REGION` | 地域（如 oss-cn-guangzhou） |
| `NEXT_PUBLIC_VIDEO_BASE_URL` | 视频 CDN 地址（如 https://wangzhanxie.oss-cn-guangzhou.aliyuncs.com/videos） |

## 2. 在 OSS 控制台开启静态网站托管

1. 登录 [OSS 控制台](https://oss.console.aliyun.com/)
2. 进入对应 Bucket → 基础设置 → 静态页面
3. 开启「静态页面」/「静态网站托管」
4. 默认首页设为 `index.html`，默认 404 页可选 `404.html`

## 3. 自动部署流程

推送代码到 `main` 分支后，GitHub Actions 会：

1. 拉取代码
2. 安装依赖并构建（生成 `out/` 目录）
3. 将 `out/` 内容上传到 OSS Bucket 根目录

部署完成后，通过 Bucket 的访问域名或绑定的自定义域名即可访问网站。
