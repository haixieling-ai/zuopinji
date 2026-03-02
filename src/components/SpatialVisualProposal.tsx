"use client";

import { useState } from "react";

export interface SpatialSlide {
  image: string;
  title: string;
  description: string;
  params: string;
}

const DEFAULT_SLIDES: SpatialSlide[] = [
  {
    image: "https://picsum.photos/seed/spatial1/1200/800",
    title: "客厅空间方案 A",
    description: "以自然光为主导的开放式起居空间，木质与浅灰搭配，营造温暖通透的居住氛围。",
    params: "3ds Max + Corona | 2025",
  },
  {
    image: "https://picsum.photos/seed/spatial2/1200/800",
    title: "卧室空间方案 B",
    description: "低饱和度的暖色调空间，柔和的间接照明，强调舒适与私密性。",
    params: "3ds Max + Corona | 2025",
  },
  {
    image: "https://picsum.photos/seed/spatial3/1200/800",
    title: "商业展示空间",
    description: "极简主义陈列空间，强调产品与光线的互动，营造高端零售氛围。",
    params: "3ds Max + Corona | 2025",
  },
];

interface SpatialVisualProposalProps {
  slides?: SpatialSlide[];
}

export function SpatialVisualProposal({ slides = DEFAULT_SLIDES }: SpatialVisualProposalProps) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = (next: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIndex(next);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const goPrev = () => goTo((index - 1 + slides.length) % slides.length);
  const goNext = () => goTo((index + 1) % slides.length);

  const slide = slides[index];

  return (
    <div className="flex min-h-[70vh] flex-col lg:min-h-[80vh] lg:flex-row">
      {/* 左侧：图片区 70% */}
      <div className="relative flex w-full shrink-0 flex-col lg:w-[70%]">
        <div
          className="relative flex-1 overflow-hidden"
        >
          <button
            type="button"
            onClick={goNext}
            className="absolute inset-0 z-10 cursor-pointer"
            aria-label="下一张"
          >
            <span className="sr-only">切换下一张</span>
          </button>

          {/* Cross-fade 图片容器 */}
          <div className="relative h-full min-h-[320px] w-full lg:min-h-[480px]">
            {slides.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-400 ease-out"
                style={{
                  opacity: i === index ? 1 : 0,
                  transition: "opacity 500ms ease-out",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* 左右箭头 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/90 transition-colors hover:text-white"
            aria-label="上一张"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/90 transition-colors hover:text-white"
            aria-label="下一张"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 图片下方：极简参数 */}
        <p className="mt-4 text-center text-xs font-light tracking-widest text-white/50 lg:text-sm">
          {slide.params}
        </p>
      </div>

      {/* 右侧：标题与说明 30% */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:pl-12 lg:pr-8 lg:py-16">
        <h3 className="text-2xl font-bold tracking-wide text-[#fafafa] sm:text-3xl lg:text-4xl">
          {slide.title}
        </h3>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
          {slide.description}
        </p>
        <div className="mt-8 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-[#fafafa]/80" : "w-2 bg-[#fafafa]/30 hover:bg-[#fafafa]/50"
              }`}
              aria-label={`切换到第 ${i + 1} 张`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
