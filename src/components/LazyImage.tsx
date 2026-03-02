"use client";

import { useState, useRef, useEffect } from "react";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";

const IMG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230a0a0a' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%23333' font-size='14' text-anchor='middle' dy='.3em'%3E待添加%3C/text%3E%3C/svg%3E";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  /** 占位时显示的比例，减少布局偏移 */
  aspectRatio?: string;
  onError?: () => void;
}

/**
 * 懒加载图片：进入视口后再加载
 */
export function LazyImage({
  src,
  alt,
  className = "",
  aspectRatio = "auto",
  onError,
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.05, rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    setFailed(true);
    onError?.();
  };

  const displaySrc = failed ? IMG_PLACEHOLDER : ensureAbsoluteImageSrc(src);

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ aspectRatio: aspectRatio !== "auto" ? aspectRatio : undefined }}
    >
      {isInView ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={displaySrc}
          alt={alt}
          loading="lazy"
          onError={handleError}
          className="h-full w-full object-contain"
        />
      ) : (
        <div
          className="h-full w-full bg-[#0a0a0a]"
          style={{ aspectRatio: aspectRatio !== "auto" ? aspectRatio : "16/9" }}
        />
      )}
    </div>
  );
}
