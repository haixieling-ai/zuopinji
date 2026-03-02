/**
 * 媒体资源基础 URL 配置
 * 本地开发：不设置 NEXT_PUBLIC_VIDEO_BASE_URL 时使用 public/videos/ 本地路径
 * 生产环境：设置后使用 CDN（如 OSS 需带 videos 前缀，如 https://bucket.region.aliyuncs.com/videos）
 */
const IMAGE_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_IMAGE_BASE_URL) ||
  "";

const VIDEO_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_VIDEO_BASE_URL) ||
  "";

/** 显式启用本地视频：设置 NEXT_PUBLIC_USE_LOCAL_VIDEOS=true 时强制用 public/videos/ */
const USE_LOCAL_VIDEOS =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_USE_LOCAL_VIDEOS === "true";

const BASE_PATH =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BASE_PATH) || "";

function withBasePath(path: string): string {
  if (!path || typeof path !== "string") return path;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return BASE_PATH ? `${BASE_PATH}${p}` : p;
}

/** 图片完整路径：支持本地 /projects/ 或 COS CDN */
export function getImageUrl(localPath: string): string {
  if (!localPath || typeof localPath !== "string") return localPath;
  if (localPath.startsWith("data:") || localPath.startsWith("http")) return localPath;
  if (!IMAGE_BASE) return withBasePath(localPath.startsWith("/") ? localPath : `/${localPath}`);
  const name = localPath.replace(/^\//, "");
  return IMAGE_BASE.endsWith("/") ? `${IMAGE_BASE}${name}` : `${IMAGE_BASE}/${name}`;
}

/** 视频完整路径：本地开发用 /videos/xxx，生产用 CDN（OSS 路径需含 videos/） */
export function getVideoUrl(localPath: string): string {
  if (!localPath || typeof localPath !== "string") return localPath;
  if (localPath.startsWith("http")) return localPath;
  if (USE_LOCAL_VIDEOS || !VIDEO_BASE) {
    return withBasePath(localPath.startsWith("/") ? localPath : `/${localPath}`);
  }
  // OSS/CDN：保留完整相对路径（如 videos/hero.mp4），与上传脚本一致
  const pathPart = localPath.replace(/^\//, "");
  return VIDEO_BASE.endsWith("/") ? `${VIDEO_BASE}${pathPart}` : `${VIDEO_BASE}/${pathPart}`;
}
