"use client";

import { MovieSlider } from "./MovieSlider";
import { ResidentialCaseA } from "./ResidentialCaseA";
import { ResidentialCaseB } from "./ResidentialCaseB";
import { CommercialSpaceVisualization } from "./CommercialSpaceVisualization";
import { useInView } from "./useInView";
import { SPACE_PROJECT_01 } from "@/data/works";

const spaceProjects = [
  {
    id: "01",
    type: "residential" as const,
    title: "住宅空间设计 · 客厅空间",
    titleEn: "LIVING ROOM",
    isOpening: true,
    images: SPACE_PROJECT_01.living,
  },
  {
    id: "01-bedroom",
    displayId: "01",
    type: "residential" as const,
    title: "住宅空间设计 · 卧室空间",
    titleEn: "BEDROOM",
    isOpening: false,
    images: SPACE_PROJECT_01.bedroom,
  },
];

function SpaceProjectBlock({
  project,
  isCommercial,
  isOpening,
}: {
  project: (typeof spaceProjects)[number];
  isCommercial: boolean;
  isOpening?: boolean;
}) {
  const { ref, isInView } = useInView();
  const { ref: imgRef, isInView: imgInView } = useInView();
  const hasImages = project.images && project.images.length > 0;

  return (
    <section
      ref={ref}
      className={`section-block section-compact flex w-full flex-col items-center bg-transparent ${
        isOpening ? "first-main-section" : ""
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-5xl flex-col items-center px-3 transition-all duration-[1200ms] sm:px-6 md:px-8 ${
          isInView ? "animate-fade-in-view opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <header className="section-title-block section-title-to-content w-full">
          <h2 className="section-title-main">
            <span className="section-title-number">{"displayId" in project ? project.displayId : project.id}</span> {project.title}
          </h2>
          <p className="section-title-en mt-1">
            | {project.titleEn}
          </p>
        </header>

        {isCommercial && "separatorText" in project && typeof project.separatorText === "string" && (
          <div className="mb-4 w-full">
            <div className="flex flex-col items-center justify-center px-8 py-8 text-center sm:py-10">
              <p className="section-title-main text-xl font-medium tracking-[0.25em] sm:text-2xl">
                {project.separatorText}
              </p>
              {"introText" in project && typeof project.introText === "string" && (
                <p className="section-title-aux mx-auto mt-4 max-w-2xl text-base leading-loose opacity-80">
                  {project.introText}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 统一容器 max-w-5xl - 住宅空间图片缓慢向上浮现 1.5s */}
        {hasImages ? (
          <div className="section-img-wrapper flex w-full flex-col items-center justify-center bg-transparent px-3 sm:px-6 md:px-8">
            <div
              ref={imgRef}
              className={`mx-auto w-full max-w-6xl bg-transparent transition-all duration-[1500ms] ${
                imgInView ? "animate-fade-in-view-slow opacity-100" : "opacity-0 translate-y-8"
              }`}
            >
              <MovieSlider
                images={project.images}
                alt={project.title}
                rounded="lg"
                objectFit="contain"
                aspect="portrait"
              />
            </div>
          </div>
        ) : (
          isCommercial && (
            <p className="section-title-aux py-12 text-center text-sm tracking-widest opacity-40">
              商业空间作品即将更新
            </p>
          )
        )}
      </div>
    </section>
  );
}

export function SpacePortfolioShowcase() {
  return (
    <div className="w-full">
      {/* 遍历渲染各空间项目块 */}
      {spaceProjects.map((project) => (
        <div key={project.id}>
          <SpaceProjectBlock
            project={project}
            isCommercial={false}
            isOpening={"isOpening" in project && project.isOpening}
          />
          {/* 项目一（客厅+卧室）后方插入：02 住宅空间设计 A */}
          {project.id === "01-bedroom" && <ResidentialCaseA />}
          {/* 项目二下方插入：03 住宅空间设计 B */}
          {project.id === "01-bedroom" && <ResidentialCaseB />}
        </div>
      ))}
      <CommercialSpaceVisualization />
    </div>
  );
}
