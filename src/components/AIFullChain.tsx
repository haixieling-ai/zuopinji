"use client";

import { useState } from "react";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";
import { AutoPlayVideo } from "./AutoPlayVideo";

const FALLBACK_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/** 图片 404 时使用的占位图（深色背景，不显示灰色框） */
const IMG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230a0a0a' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%23333' font-size='14' text-anchor='middle' dy='.3em'%3E待添加%3C/text%3E%3C/svg%3E";

export interface ConceptImage {
  src: string;
  prompt?: string;
}

interface AIFullChainProps {
  conceptImages: ConceptImage[];
  videoSrc: string;
  secondVideoSrc?: string;
  secondConceptImages?: ConceptImage[];
  thirdVideoSrc?: string;
  thirdConceptImages?: ConceptImage[];
  fourthVideoSrc?: string;
  fourthConceptImages?: ConceptImage[];
  fifthVideoSrc?: string;
  fifthConceptImages?: ConceptImage[];
}

/* 允许 1-23 命名的图片 */
function isValidSettingsImage23(src: string): boolean {
  const name = src.split("/").pop() ?? "";
  return /^([1-9]|1\d|2[0-3])\.(jpg|jpeg|png|webp)$/i.test(name);
}

/* 仅允许 1-40 命名的图片 */
function isValidSettingsImage40(src: string): boolean {
  const name = src.split("/").pop() ?? "";
  return /^([1-9]|[1-3]\d|40)\.(jpg|jpeg|png|webp)$/i.test(name);
}

/* 仅允许 1-10 命名的图片 */
function isValidSettingsImage10(src: string): boolean {
  const name = src.split("/").pop() ?? "";
  return /^([1-9]|10)\.(jpg|jpeg|png|webp)$/i.test(name);
}

/* 仅允许 1-30 或 01-30 命名的图片（PROJECT_08 校验，暂由 baseImages4 直接使用） */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isValidSettingsImage30(src: string): boolean {
  const name = src.split("/").pop() ?? "";
  return /^(0?[1-9]|[12]\d|30)\.(jpg|jpeg|png|webp)$/i.test(name);
}

/* 仅允许 1-6 命名的图片 */
function isValidSettingsImage6(src: string): boolean {
  const name = src.split("/").pop() ?? "";
  return /^([1-6])\.(jpg|jpeg|png|webp)$/i.test(name);
}

/* 图片路径：/projects/project-05/settings/，1.jpg–23.jpg，Map 循环渲染 */
const SETTINGS_IMAGES: ConceptImage[] = Array.from({ length: 23 }, (_, i) => ({
  src: `/projects/project-05/settings/${i + 1}.jpg`,
}));

/* 排除 project-06 中不存在的图片（如 17.jpg）避免 404 */
const PROJECT_06_MISSING = [17];
const PROJECT_06_IMAGES: ConceptImage[] = Array.from({ length: 40 }, (_, i) => i + 1)
  .filter((n) => !PROJECT_06_MISSING.includes(n))
  .map((n) => ({
    src: `/projects/project-06/settings/${n}.jpg`,
    prompt: `项目二设定图 ${n}`,
  }));

const PROJECT_07_IMAGES: ConceptImage[] = Array.from({ length: 10 }, (_, i) => ({
  src: `/projects/project-07/settings/${i + 1}.jpg`,
  prompt: `项目三设定图 ${i + 1}`,
}));

const PROJECT_08_IMAGES: ConceptImage[] = Array.from({ length: 30 }, (_, i) => ({
  src: `/projects/project-08/settings/${i + 1}.jpg`,
  prompt: `项目四设定图 ${i + 1}`,
}));

const PROJECT_09_IMAGES: ConceptImage[] = Array.from({ length: 6 }, (_, i) => ({
  src: `/projects/project-09/settings/${i + 1}.jpg`,
  prompt: `项目五设定图 ${i + 1}`,
}));

export function AIFullChain({ conceptImages, videoSrc, secondVideoSrc, secondConceptImages, thirdVideoSrc, thirdConceptImages, fourthVideoSrc, fourthConceptImages, fifthVideoSrc, fifthConceptImages }: AIFullChainProps) {
  const [, setHoveredIndex] = useState<number | null>(null);
  const [hoveredIndex2, setHoveredIndex2] = useState<number | null>(null);
  const [hoveredIndex3, setHoveredIndex3] = useState<number | null>(null);
  const [hoveredIndex4, setHoveredIndex4] = useState<number | null>(null);
  const [hoveredIndex5, setHoveredIndex5] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [failedConcept1, setFailedConcept1] = useState<Set<string>>(new Set());
  const [effectiveVideoSrc, setEffectiveVideoSrc] = useState(videoSrc);
  const [effectiveSecondVideoSrc, setEffectiveSecondVideoSrc] = useState(secondVideoSrc ?? "");
  const rawImages1 = conceptImages.length > 0 ? conceptImages : SETTINGS_IMAGES;
  const baseImages1 = rawImages1.filter((item) => {
    const s = typeof item === "string" ? item : item.src;
    return isValidSettingsImage23(s);
  });
  const displayImages1 = (baseImages1.length > 0 ? baseImages1 : rawImages1).filter(
    (item) => !failedConcept1.has(typeof item === "string" ? item : item.src)
  );
  const marqueeImages1 = displayImages1.length > 0 ? [...displayImages1, ...displayImages1] : [];

  const rawImages2 = (secondConceptImages && secondConceptImages.length > 0) ? secondConceptImages : PROJECT_06_IMAGES;
  const baseImages2 = rawImages2.filter((item) => {
    const s = typeof item === "string" ? item : item.src;
    return isValidSettingsImage40(s);
  });
  const marqueeImages2 = [...baseImages2, ...baseImages2];

  const rawImages3 = (thirdConceptImages && thirdConceptImages.length > 0) ? thirdConceptImages : PROJECT_07_IMAGES;
  const baseImages3 = rawImages3.filter((item) => {
    const s = typeof item === "string" ? item : item.src;
    return isValidSettingsImage10(s);
  });
  const marqueeImages3 = baseImages3.length > 0 ? [...baseImages3, ...baseImages3] : baseImages3;

  const rawImages4 = (fourthConceptImages && fourthConceptImages.length > 0) ? fourthConceptImages : PROJECT_08_IMAGES;
  const baseImages4 = rawImages4;
  const marqueeImages4 = [...baseImages4, ...baseImages4];

  const rawImages5 = (fifthConceptImages && fifthConceptImages.length > 0) ? fifthConceptImages : PROJECT_09_IMAGES;
  const baseImages5 = rawImages5.filter((item) => {
    const s = typeof item === "string" ? item : item.src;
    return isValidSettingsImage6(s);
  });
  const marqueeImages5 = [...baseImages5, ...baseImages5];

  return (
    <div
      className="section-img-wrapper mx-auto flex w-full max-w-5xl flex-col items-center bg-transparent"
      style={{ gap: "var(--content-gap, 12px)" }}
    >
      {/* 主标题 */}
      <h3 className="section-title-aux w-full text-center text-lg font-medium uppercase tracking-[0.2em] opacity-80 md:text-xl">
        AIGC 全链路叙事：从概念设定到动态成片
      </h3>

      {/* 1. 视频层 - 进入视口自动播放 */}
      <div data-cursor-invert className="w-full overflow-hidden bg-transparent">
        <AutoPlayVideo
          src={effectiveVideoSrc}
          onError={() => {
            if (effectiveVideoSrc !== FALLBACK_VIDEO) setEffectiveVideoSrc(FALLBACK_VIDEO);
          }}
        />
      </div>

      {/* 2. 设计方案 - 无限水平滚动 Marquee（紧接第一个视频下方），仅显示成功加载的图片 */}
      {displayImages1.length > 0 && (
      <div className="w-full flex flex-col items-center bg-transparent">
        <h4 className="content-gap section-title-aux text-center text-base font-medium uppercase tracking-[0.2em] opacity-80">
          设计方案 (Concept Designs)
        </h4>
        <div data-cursor-invert className="concept-scroll-pause w-full overflow-hidden bg-transparent">
          <div className="flex w-max animate-scroll-concept gap-6">
            {marqueeImages1.map((item, i) => {
              const src = typeof item === "string" ? item : item.src;
              const baseLen = displayImages1.length;
              return (
                <div
                  key={`${src}-${i}`}
                  className="group relative h-48 shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedImage(ensureAbsoluteImageSrc(src))}
                >
                  <div className="relative h-full overflow-hidden transition-all duration-300 group-hover:scale-[1.02]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ensureAbsoluteImageSrc(src)}
                      alt={`设定图 ${(i % baseLen) + 1}`}
                      className="h-full w-auto min-w-[180px] object-contain"
                      style={{ aspectRatio: "auto" }}
                      loading="lazy"
                      onError={() => {
                        setFailedConcept1((prev) => new Set(prev).add(src));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* 3. 项目二视频 */}
      {secondVideoSrc && (
        <div data-cursor-invert className="w-full overflow-hidden bg-transparent">
          <AutoPlayVideo
            key={effectiveSecondVideoSrc}
            src={effectiveSecondVideoSrc || secondVideoSrc}
            onError={() => {
              const current = effectiveSecondVideoSrc || secondVideoSrc;
              if (current !== FALLBACK_VIDEO) setEffectiveSecondVideoSrc(FALLBACK_VIDEO);
            }}
          />
        </div>
      )}

      {/* 4. 项目二设计方案 - project-06/settings 40 张 */}
      {secondVideoSrc && baseImages2.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <h4 className="content-gap section-title-aux text-center text-base font-medium uppercase tracking-[0.2em] opacity-80">
            02 设计方案 (Concept Designs)
          </h4>
          <div data-cursor-invert className="concept-scroll-pause w-full overflow-hidden bg-transparent">
            <div className="flex w-max animate-scroll-concept-fast gap-6">
              {marqueeImages2.map((item, i) => {
                const src = typeof item === "string" ? item : item.src;
                const prompt = typeof item === "string" ? undefined : item.prompt;
                const isHovered = hoveredIndex2 === i;
                const baseLen = baseImages2.length;
                return (
                  <div
                    key={`p2-${src}-${i}`}
                    className="group relative h-48 shrink-0 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex2(i)}
                    onMouseLeave={() => setHoveredIndex2(null)}
                    onClick={() => setSelectedImage(ensureAbsoluteImageSrc(src))}
                  >
                    <div
                      className={`relative h-full overflow-hidden transition-all duration-300 ${
                        isHovered ? "scale-[1.02]" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ensureAbsoluteImageSrc(src)}
                        alt={`项目二设定图 ${(i % baseLen) + 1}`}
                        className="h-full w-auto min-w-[180px] object-contain"
                        style={{ aspectRatio: "auto" }}
                        loading="lazy"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (t.src !== IMG_PLACEHOLDER) {
                            t.src = IMG_PLACEHOLDER;
                            t.onerror = null;
                          }
                        }}
                      />
                      {prompt && (
                        <div
                          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-3 transition-opacity ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <p className="section-title-aux line-clamp-2 text-xs leading-relaxed opacity-80">
                            {prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. 项目三视频 */}
      {thirdVideoSrc && (
        <div data-cursor-invert className="w-full overflow-hidden bg-transparent">
          <AutoPlayVideo src={thirdVideoSrc} />
        </div>
      )}

      {/* 6. 项目三设计方案 - project-07/settings 10 张 */}
      {thirdVideoSrc && baseImages3.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <h4 className="content-gap section-title-aux text-center text-sm font-medium uppercase tracking-[0.2em] opacity-80">
            03 设计方案 (Concept Designs)
          </h4>
          <div data-cursor-invert className="concept-scroll-pause w-full overflow-hidden bg-transparent">
            <div className="flex w-max animate-scroll-concept-p3 gap-6">
              {marqueeImages3.map((item, i) => {
                const src = typeof item === "string" ? item : item.src;
                const prompt = typeof item === "string" ? undefined : item.prompt;
                const isHovered = hoveredIndex3 === i;
                const baseLen = baseImages3.length;
                return (
                  <div
                    key={`p3-${src}-${i}`}
                    className="group relative h-48 shrink-0 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex3(i)}
                    onMouseLeave={() => setHoveredIndex3(null)}
                    onClick={() => setSelectedImage(ensureAbsoluteImageSrc(src))}
                  >
                    <div
                      className={`relative h-full overflow-hidden transition-all duration-300 ${
                        isHovered ? "scale-[1.02]" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ensureAbsoluteImageSrc(src)}
                        alt={`项目三设定图 ${(i % baseLen) + 1}`}
                        className="h-full w-auto min-w-[180px] object-contain"
                        style={{ aspectRatio: "auto" }}
                        loading="lazy"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (t.src !== IMG_PLACEHOLDER) {
                            t.src = IMG_PLACEHOLDER;
                            t.onerror = null;
                          }
                        }}
                      />
                      {prompt && (
                        <div
                          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-3 transition-opacity ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <p className="section-title-aux line-clamp-2 text-xs leading-relaxed opacity-80">
                            {prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. 项目四视频 */}
      {fourthVideoSrc && (
        <div data-cursor-invert className="w-full overflow-hidden bg-transparent">
          <AutoPlayVideo src={fourthVideoSrc} />
        </div>
      )}

      {/* 8. 项目四设计方案 - project-08/settings 30 张 */}
      {fourthVideoSrc && (
        <div className="w-full flex flex-col items-center">
          <h4 className="content-gap section-title-aux text-center text-sm font-medium uppercase tracking-[0.2em] opacity-80">
            04 设计方案 (Concept Designs)
          </h4>
          <div data-cursor-invert className="concept-scroll-pause w-full overflow-hidden bg-transparent">
            <div className="flex w-max animate-scroll-concept-p4 gap-6">
              {marqueeImages4.map((item, i) => {
                const src = typeof item === "string" ? item : item.src;
                const prompt = typeof item === "string" ? undefined : item.prompt;
                const isHovered = hoveredIndex4 === i;
                return (
                  <div
                    key={`p4-${src}-${i}`}
                    className="group relative h-48 shrink-0 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex4(i)}
                    onMouseLeave={() => setHoveredIndex4(null)}
                    onClick={() => setSelectedImage(ensureAbsoluteImageSrc(src))}
                  >
                    <div
                      className={`relative h-full overflow-hidden transition-all duration-300 ${
                        isHovered ? "scale-[1.02]" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ensureAbsoluteImageSrc(src)}
                        alt={`项目四设定图 ${(i % baseImages4.length) + 1}`}
                        className="h-full w-auto min-w-[180px] object-contain"
                        style={{ aspectRatio: "auto" }}
                        loading="lazy"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (t.src !== IMG_PLACEHOLDER) {
                            t.src = IMG_PLACEHOLDER;
                            t.onerror = null;
                          }
                        }}
                      />
                      {prompt && (
                        <div
                          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-3 transition-opacity ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <p className="line-clamp-2 text-xs text-[#E5E5E5]">
                            {prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9. 项目五视频 */}
      {fifthVideoSrc && (
        <div data-cursor-invert className="w-full overflow-hidden bg-transparent">
          <AutoPlayVideo src={fifthVideoSrc} />
        </div>
      )}

      {/* 10. 项目五设计方案 - project-09/settings 6 张 */}
      {fifthVideoSrc && baseImages5.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <h4 className="content-gap section-title-aux text-center text-sm font-medium uppercase tracking-[0.2em] opacity-80">
            05 设计方案 (Concept Designs)
          </h4>
          <div data-cursor-invert className="concept-scroll-pause w-full overflow-hidden bg-transparent">
            <div className="flex w-max animate-scroll-concept-p5 gap-6">
              {marqueeImages5.map((item, i) => {
                const src = typeof item === "string" ? item : item.src;
                const prompt = typeof item === "string" ? undefined : item.prompt;
                const isHovered = hoveredIndex5 === i;
                const baseLen = baseImages5.length;
                return (
                  <div
                    key={`p5-${src}-${i}`}
                    className="group relative h-48 shrink-0 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex5(i)}
                    onMouseLeave={() => setHoveredIndex5(null)}
                    onClick={() => setSelectedImage(ensureAbsoluteImageSrc(src))}
                  >
                    <div
                      className={`relative h-full overflow-hidden transition-all duration-300 ${
                        isHovered ? "scale-[1.02]" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ensureAbsoluteImageSrc(src)}
                        alt={`项目五设定图 ${(i % baseLen) + 1}`}
                        className="h-full w-auto min-w-[180px] object-contain"
                        style={{ aspectRatio: "auto" }}
                        loading="lazy"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (t.src !== IMG_PLACEHOLDER) {
                            t.src = IMG_PLACEHOLDER;
                            t.onerror = null;
                          }
                        }}
                      />
                      {prompt && (
                        <div
                          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-3 transition-opacity ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <p className="line-clamp-2 text-xs text-[#E5E5E5]">
                            {prompt}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox 全屏放大 */}
      {selectedImage && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-[#000000]/95 p-4"
          onClick={() => setSelectedImage(null)}
          aria-label="关闭放大"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ensureAbsoluteImageSrc(selectedImage)}
            alt="设定图放大查看"
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}
    </div>
  );
}
