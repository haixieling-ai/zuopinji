"use client";

import { useState } from "react";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";

interface Carousel3DProps {
  images: string[];
  alt?: string;
}

export function Carousel3D({ images, alt = "3D 效果图" }: Carousel3DProps) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const goPrev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);

  if (!images.length) return null;

  return (
    <>
      <div data-cursor-invert className="group relative mx-auto w-full max-w-5xl overflow-hidden bg-transparent">
        <div className="relative aspect-[16/10] w-full bg-transparent sm:aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ensureAbsoluteImageSrc(images[index])}
            alt={`${alt} ${index + 1}`}
            className="h-full w-full cursor-zoom-in object-contain transition-transform hover:scale-[1.02]"
            onClick={() => setFullscreen(true)}
          />

          {/* 左右切换箭头 */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/60 opacity-0 transition-opacity hover:text-white/90 group-hover:opacity-100"
            aria-label="上一张"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/60 opacity-0 transition-opacity hover:text-white/90 group-hover:opacity-100"
            aria-label="下一张"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 页码指示 */}
          <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 px-3 py-1 text-sm text-white/90">
            {index + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* 全屏 PPT 模式 */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/95 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
          role="presentation"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 z-[101] flex h-10 w-10 items-center justify-center rounded-full bg-[#fafafa]/10 text-white transition-colors hover:bg-[#fafafa]/20"
            aria-label="关闭全屏"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 z-[101] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#fafafa]/10 text-white transition-colors hover:bg-[#fafafa]/20"
            aria-label="上一张"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ensureAbsoluteImageSrc(images[index])}
            alt={`${alt} ${index + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 z-[101] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#fafafa]/10 text-white transition-colors hover:bg-[#fafafa]/20"
            aria-label="下一张"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-sm text-white/90">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
