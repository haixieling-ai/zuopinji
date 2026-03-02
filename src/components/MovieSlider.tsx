"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";

/** 占位图：加载失败时显示的优雅占位 SVG data URI */
const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3Cpath d='M120 100h160v100H120z' stroke='%23333' stroke-width='1' fill='none'/%3E%3Cpath d='M140 120h60v20h-60z' stroke='%23444' stroke-width='1' fill='none'/%3E%3Ctext x='200' y='230' fill='%23666' font-family='sans-serif' font-size='14' text-anchor='middle'%3E图片加载失败%3C/text%3E%3C/svg%3E";

interface MovieSliderProps {
  images: string[];
  alt?: string;
  rounded?: "lg" | "xl" | "2xl";
  /** 完整显示图片不裁剪，适用于竖屏照片 */
  objectFit?: "cover" | "contain";
  /** 容器比例：landscape 横屏 / portrait 竖屏友好 */
  aspect?: "landscape" | "portrait";
}

/** 需要加载的索引：当前 + 前后各一张，避免切换黑屏 */
function shouldLoadImage(currentIndex: number, total: number, i: number): boolean {
  if (i === currentIndex) return true;
  const prev = (currentIndex - 1 + total) % total;
  const next = (currentIndex + 1) % total;
  return i === prev || i === next;
}

export function MovieSlider({
  images,
  alt = "空间效果图",
  rounded = "lg",
  objectFit = "cover",
  aspect = "landscape",
}: MovieSliderProps) {
  const [index, setIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const handleImageError = useCallback((i: number) => {
    setFailedIndices((prev) => new Set(prev).add(i));
  }, []);

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  if (!images.length) return null;

  const roundedClass = rounded === "2xl" ? "rounded-2xl" : rounded === "xl" ? "rounded-xl" : "rounded-lg";
  const maxH = "max-h-[55vh]";
  const aspectClass =
    aspect === "portrait"
      ? `h-[55vh] ${maxH} flex items-center justify-center min-h-[240px]`
      : "aspect-[16/10] sm:aspect-[16/9]";

  return (
    <div data-cursor-invert className={`group relative w-full overflow-hidden bg-transparent ${roundedClass}`}>
      {/* Cross-fade 电影感幻灯片，仅加载当前及相邻图片，减少首屏请求 */}
      <div
        className={`relative flex w-full cursor-pointer items-center justify-center bg-transparent ${aspectClass} ${roundedClass}`}
        onClick={goNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        {images.map((src, i) => {
          const hasFailed = failedIndices.has(i);
          const displaySrc = hasFailed ? PLACEHOLDER_SVG : ensureAbsoluteImageSrc(src);
          const load = shouldLoadImage(index, images.length, i);
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out"
              style={{
                opacity: i === index ? 1 : 0,
                pointerEvents: i === index ? "auto" : "none",
                zIndex: i === index ? 1 : 0,
              }}
            >
              <div className={`relative h-full w-full  ${roundedClass}`}>
                {load ? (
                  <Image
                    src={displaySrc}
                    alt={hasFailed ? `占位图` : `${alt} ${i + 1}`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    unoptimized
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    onError={() => handleImageError(i)}
                    className={`${objectFit === "contain" ? "object-contain" : "object-cover"} object-center`}
                  />
                ) : (
                  <div className="h-full w-full bg-[#0a0a0a]" />
                )}
              </div>
            </div>
          );
        })}

        {/* 滑动箭头：超细线条，仅悬停时显现 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center text-white/40 opacity-0 transition-opacity hover:text-white/70 group-hover:opacity-100 sm:left-4"
          aria-label="上一张"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={0.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center text-white/40 opacity-0 transition-opacity hover:text-white/70 group-hover:opacity-100 sm:right-4"
          aria-label="下一张"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={0.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-sm tracking-widest text-white/50">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
