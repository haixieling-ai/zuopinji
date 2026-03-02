"use client";

import { MovieSlider } from "./MovieSlider";
import { useInView } from "./useInView";
import { SPACE_PROJECT_02 } from "@/data/works";

const livingImages = SPACE_PROJECT_02.living;
const bedroomImages = SPACE_PROJECT_02.bedroom;

function AreaBlock({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const { ref: imgRef, isInView: imgInView } = useInView();
  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={imgRef}
        className={`section-img-wrapper mx-auto w-full max-w-6xl px-3 transition-all duration-[1500ms] sm:px-6 md:px-8 ${
          imgInView ? "animate-fade-in-view-slow opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <MovieSlider images={images} alt={title} rounded="lg" objectFit="contain" aspect="portrait" />
      </div>
    </div>
  );
}

export function ResidentialCaseA() {
  const { ref, isInView } = useInView();

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
            <span className="section-title-number">02</span> 住宅空间设计 A
          </h2>
          <p className="section-title-en mt-1">
            | RESIDENTIAL CASE A
          </p>
        </header>
        <div className="mb-0 w-full">
          <AreaBlock title="Living Area" images={livingImages} />
        </div>
        <div className="w-full">
          <AreaBlock title="Bedroom Area" images={bedroomImages} />
        </div>
      </div>
    </section>
  );
}
