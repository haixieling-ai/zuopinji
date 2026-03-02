/**
 * 将 public/videos 下的视频上传到阿里云 OSS
 *
 * 使用前请配置 .env.local：
 *   OSS_REGION=oss-cn-hangzhou
 *   OSS_ACCESS_KEY_ID=你的AccessKeyId
 *   OSS_ACCESS_KEY_SECRET=你的AccessKeySecret
 *   OSS_BUCKET=你的Bucket名称
 *
 * 运行：node scripts/upload-videos-to-oss.js
 */

const path = require("path");
const fs = require("fs");

// 加载 .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

const region = process.env.OSS_REGION;
const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
const bucket = process.env.OSS_BUCKET;

if (!region || !accessKeyId || !accessKeySecret || !bucket) {
  console.error("请在 .env.local 中配置：OSS_REGION, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET");
  process.exit(1);
}

const OSS = require("ali-oss");
const client = new OSS({
  region,
  accessKeyId,
  accessKeySecret,
  bucket,
  timeout: "600s", // 10 分钟，大视频需要更长时间
});

const VIDEOS_DIR = path.join(__dirname, "..", "public", "videos");
const OSS_PREFIX = "videos"; // OSS 存储路径前缀

async function upload() {
  const files = fs.readdirSync(VIDEOS_DIR).filter((f) => /\.(mp4|MP4)$/i.test(f));
  if (files.length === 0) {
    console.log("public/videos 下没有 mp4 文件");
    return;
  }

  for (const file of files) {
    const localPath = path.join(VIDEOS_DIR, file);
    const ossKey = `${OSS_PREFIX}/${file}`;
    try {
      await client.put(ossKey, localPath);
      const url = `https://${bucket}.${region}.aliyuncs.com/${ossKey}`;
      console.log(`✓ ${file} -> ${url}`);
    } catch (e) {
      console.error(`✗ ${file} 上传失败:`, e.message);
    }
  }

  console.log("\n上传完成。请设置 NEXT_PUBLIC_VIDEO_BASE_URL 为你的 OSS 域名，例如：");
  console.log(`  https://${bucket}.${region}.aliyuncs.com/${OSS_PREFIX}`);
}

upload().catch(console.error);
