"use client";

import { useInView } from "./useInView";

const DESIGN_QUOTE =
  "致力于将传统设计的严谨审美与 AI 技术的高效产出相结合，重塑商业空间的视觉表达边界。";

const tools = [
  { name: "Midjourney", role: "材质与氛围推演" },
  { name: "ComfyUI", role: "工作流自动化" },
  { name: "3ds Max + Corona", role: "传统渲染核心" },
];

export function AIGCQuoteSection() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="section-block flex w-full flex-col items-center bg-transparent"
    >
      <div
        className={`mx-auto flex w-full max-w-5xl flex-col items-center bg-transparent px-3 transition-all duration-[1200ms] ease-out sm:px-6 md:px-8 ${
          isInView ? "animate-fade-in-view opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <h4 className="section-title-aux mb-4 text-center text-xs font-light uppercase tracking-[0.35em] opacity-80">
          AI Workflow
        </h4>
        <p className="section-title-aux mx-auto mb-6 max-w-2xl text-center text-sm leading-loose tracking-[0.15em] opacity-90">
          利用 Midjourney 和 ComfyUI 辅助传统渲染（3ds Max + Corona）进行材质优化和氛围推演，实现
          AIGC 与 3D 管线的深度协同。
        </p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {tools.map((t) => (
            <div
              key={t.name}
              className="flex flex-col items-center px-4 py-3"
            >
              <span className="section-title-aux text-sm font-medium uppercase tracking-[0.2em] opacity-80">
                {t.name}
              </span>
              <span className="section-title-aux mt-2 text-xs leading-relaxed tracking-[0.2em] opacity-80">
                {t.role}
              </span>
            </div>
          ))}
        </div>
        <p className="section-title-aux mx-auto mt-8 max-w-2xl text-center text-sm font-light leading-loose tracking-[0.15em] opacity-90">
          &ldquo;{DESIGN_QUOTE}&rdquo;
        </p>
      </div>
    </section>
  );
}
