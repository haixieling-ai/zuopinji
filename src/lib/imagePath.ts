/**
 * 将图片路径转为绝对路径
 */
export function ensureAbsoluteImageSrc(src: string): string {
  if (!src || typeof src !== "string") return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/public")) return src.replace(/^\/public/, "");
  return src.startsWith("/") ? src : `/${src}`;
}
