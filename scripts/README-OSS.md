# 视频上传到阿里云 OSS

## 1. 获取 OSS 凭证

登录 [阿里云控制台](https://ram.console.aliyun.com/) → 创建 AccessKey，获取 **AccessKey ID** 和 **AccessKey Secret**。

在 OSS 控制台创建 Bucket，记下 **Bucket 名称** 和 **地域**（如 `oss-cn-hangzhou`）。

## 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入你的 OSS 信息：

```bash
OSS_REGION=oss-cn-hangzhou
OSS_ACCESS_KEY_ID=你的AccessKeyId
OSS_ACCESS_KEY_SECRET=你的AccessKeySecret
OSS_BUCKET=你的Bucket名称
```

## 3. 执行上传

```bash
npm run upload:videos
```

上传完成后会输出每个视频的 OSS URL。

## 4. 配置前端加载

在 `.env.local` 中添加（部署时在 Vercel 等平台配置相同变量）：

```
NEXT_PUBLIC_VIDEO_BASE_URL=https://你的bucket.oss-cn-hangzhou.aliyuncs.com/videos
```

若使用自定义域名或 CDN，则填入对应前缀。
