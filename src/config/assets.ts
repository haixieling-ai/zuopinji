/**
 * 媒体资源基础 URL 配置
 *
 * 图片 & 工作流等静态资源：
 * - 默认仍走 Next.js 本地 public 目录（不破坏现有页面展示）
 * - 如需迁移到 OSS，请配置环境变量：
 *   NEXT_PUBLIC_IMAGE_BASE_URL=https://haixieling.oss-cn-shenzhen.aliyuncs.com
 *   则：
 *   - /projects/... => https://haixieling.oss-cn-shenzhen.aliyuncs.com/projects/...
 *   - /workflows/... => https://haixieling.oss-cn-shenzhen.aliyuncs.com/workflows/...
 *
 * 视频：
 * - 已优先使用外链（见 src/data/works.ts 中 VIDEO_PATHS）
 * - 如需统一切换到 CDN，可配置 NEXT_PUBLIC_VIDEO_BASE_URL
 */

/** 阿里云 OSS Bucket 基础域名（集中管理，全局唯一修改点） */
export const OSS_IMAGE_BASE =
  "https://haixieling.oss-cn-shenzhen.aliyuncs.com";

/** /projects/ 图片统一 OSS 前缀 */
export const OSS_PROJECTS_BASE = `${OSS_IMAGE_BASE}/projects`;

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

/**
 * 图片完整路径：
 * - 支持本地 /projects/XXX 或 /workflows/XXX
 * - 配置 NEXT_PUBLIC_IMAGE_BASE_URL 后统一走 OSS/CDN
 *   例如：
 *   NEXT_PUBLIC_IMAGE_BASE_URL=https://haixieling.oss-cn-shenzhen.aliyuncs.com
 *   getImageUrl("/projects/project-01/img.jpg")
 *   => https://haixieling.oss-cn-shenzhen.aliyuncs.com/projects/project-01/img.jpg
 */
export function getImageUrl(localPath: string): string {
  if (!localPath || typeof localPath !== "string") return localPath;
  if (localPath.startsWith("data:") || localPath.startsWith("http")) return localPath;
  const normalized = localPath.startsWith("/") ? localPath.slice(1) : localPath;

  // 未配置远端时，走本地 public 目录，保持现有行为不变
  if (!IMAGE_BASE) {
    return withBasePath(`/${normalized}`);
  }

  // 配置了远端时，统一拼接到 OSS 根路径下
  const base = IMAGE_BASE.endsWith("/") ? IMAGE_BASE.slice(0, -1) : IMAGE_BASE;
  return `${base}/${normalized}`;
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
