"use client";

import { MovieSlider } from "./MovieSlider";
import { useInView } from "./useInView";
import { SPACE_PROJECT_04 } from "@/data/works";

const commercialImages = SPACE_PROJECT_04;

export function CommercialSpaceVisualization() {
  const { ref, isInView } = useInView();
  const { ref: imgRef, isInView: imgInView } = useInView();

  return (
    <section
      ref={ref}
      className="section-block section-compact flex w-full flex-col items-center bg-transparent"
    >
      <div
        className={`mx-auto flex w-full max-w-5xl flex-col items-center px-3 transition-all duration-[1200ms] sm:px-6 md:px-8 ${
          isInView ? "animate-fade-in-view opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <header className="section-title-block section-title-to-content w-full">
          <h2 className="section-title-main">
            <span className="section-title-number">04</span> 商业空间视觉表现
          </h2>
          <p className="section-title-en mt-1">
            | COMMERCIAL SPACE VISUALIZATION
          </p>
        </header>
        <div className="flex w-full flex-col items-center">
          <div
            ref={imgRef}
            className={`section-img-wrapper mx-auto w-full max-w-6xl px-3 transition-all duration-[1500ms] sm:px-6 md:px-8 ${
              imgInView ? "animate-fade-in-view-slow opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            <MovieSlider
              images={commercialImages}
              alt="商业空间视觉表现"
              rounded="lg"
              objectFit="contain"
              aspect="portrait"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
