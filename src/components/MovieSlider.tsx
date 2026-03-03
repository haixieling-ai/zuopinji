"use client";

import { useState, useCallback, useRef } from "react";
import type { PointerEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%231a1a1a'/%3E%3Cpath d='M120 100h160v100H120z' stroke='%23333' stroke-width='1' fill='none'/%3E%3Cpath d='M140 120h60v20h-60z' stroke='%23444' stroke-width='1' fill='none'/%3E%3Ctext x='200' y='230' fill='%23666' font-family='sans-serif' font-size='14' text-anchor='middle'%3E图片加载失败%3C/text%3E%3C/svg%3E";

interface MovieSliderProps {
  images: string[];
  alt?: string;
  rounded?: "lg" | "xl" | "2xl";
  objectFit?: "cover" | "contain";
  aspect?: "landscape" | "portrait";
}

/**
 * 预加载窗口：当前 + 前后各 2 张
 * 保证快速滑动时下一张已就绪，同时不一次性请求所有大图
 */
function shouldLoadImage(currentIndex: number, total: number, i: number): boolean {
  if (total <= 5) return true;
  const offsets = [-2, -1, 0, 1, 2];
  return offsets.some((o) => (currentIndex + o + total) % total === i);
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
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageError = useCallback((i: number) => {
    setFailedIndices((prev) => new Set(prev).add(i));
  }, []);

  const handleImageLoad = useCallback((i: number) => {
    setLoadedIndices((prev) => new Set(prev).add(i));
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setIsDragging(true);
    setHasMoved(false);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX == null) return;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 3 && !hasMoved) {
      setHasMoved(true);
    }
    setDragDeltaX(delta);
  };

  const finishDrag = (triggerClickIfNoSwipe: boolean) => {
    const width = containerRef.current?.offsetWidth ?? 0;
    const threshold = width ? width * 0.12 : 48;

    if (Math.abs(dragDeltaX) > threshold) {
      if (dragDeltaX < 0) goNext();
      else goPrev();
    } else if (triggerClickIfNoSwipe && !hasMoved) {
      goNext();
    }

    setIsDragging(false);
    setDragStartX(null);
    setDragDeltaX(0);
    setHasMoved(false);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    finishDrag(true);
  };

  const handlePointerCancel = () => {
    if (!isDragging) return;
    finishDrag(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goNext();
    }
  };

  if (!images.length) return null;

  const roundedClass = rounded === "2xl" ? "rounded-2xl" : rounded === "xl" ? "rounded-xl" : "rounded-lg";
  const maxH = "max-h-[55vh]";
  const aspectClass =
    aspect === "portrait"
      ? `h-[55vh] ${maxH} flex items-center justify-center min-h-[240px]`
      : "aspect-[16/10] sm:aspect-[16/9]";

  return (
    <div data-cursor-invert className={`group relative w-full overflow-hidden bg-transparent ${roundedClass}`}>
      <div
        ref={containerRef}
        className={`relative flex w-full cursor-pointer items-center justify-center bg-transparent ${aspectClass} ${roundedClass}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {images.map((src, i) => {
          const hasFailed = failedIndices.has(i);
          const displaySrc = hasFailed ? PLACEHOLDER_SVG : ensureAbsoluteImageSrc(src);
          const load = shouldLoadImage(index, images.length, i);
          const isActive = i === index;
          const isLoaded = loadedIndices.has(i) || hasFailed;
          const dragOffset = isActive ? dragDeltaX * 0.25 : 0;
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 1 : 0,
                transform: `translate3d(${dragOffset}px, 0, 0) scale(${isActive ? 1 : 0.985})`,
                transition: isDragging
                  ? "none"
                  : "opacity 480ms ease-out, transform 480ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className={`relative h-full w-full ${roundedClass}`}>
                {load ? (
                  <>
                    {/* 未加载完成时的脉冲占位背景 */}
                    {!isLoaded && (
                      <div className="absolute inset-0 z-0 animate-pulse bg-[#111]" />
                    )}
                    <Image
                      src={displaySrc}
                      alt={hasFailed ? "占位图" : `${alt} ${i + 1}`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      unoptimized
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      onLoad={() => handleImageLoad(i)}
                      onError={() => handleImageError(i)}
                      className={`${objectFit === "contain" ? "object-contain" : "object-cover"} object-center transition-opacity duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                  </>
                ) : (
                  <div className="h-full w-full bg-[#0a0a0a]" />
                )}
              </div>
            </div>
          );
        })}

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
