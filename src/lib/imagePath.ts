import { getImageUrl } from "@/config/assets";

/**
 * 将图片路径转为最终可用的绝对路径
 *
 * 约定：
 * - 图片统一通过 getImageUrl 走集中配置（可一键切换 OSS Bucket）
 * - JSON / 其他非图片资源（如工作流 .json）保持本地相对路径，不走 OSS
 */
export function ensureAbsoluteImageSrc(src: string): string {
  if (!src || typeof src !== "string") return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const lower = src.toLowerCase();
  const isJson = lower.endsWith(".json");

  // 去掉 /public 前缀，保持与 Next public 目录对齐
  const normalized = src.startsWith("/public") ? src.replace(/^\/public/, "") : src;

  // JSON 等非图片资源：仍然走本地路径，避免打断现有工作流 JSON 加载
  if (isJson) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  // 图片：统一通过 getImageUrl 走集中配置（本地或 OSS）
  return getImageUrl(normalized);
}
