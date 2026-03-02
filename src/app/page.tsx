"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AIFullChain } from "@/components/AIFullChain";
import { AIGCLabSection } from "@/components/AIGCLabSection";
import { SpacePortfolioShowcase } from "@/components/SpacePortfolioShowcase";
import { AIGCQuoteSection } from "@/components/AIGCQuoteSection";
import { useInView } from "@/components/useInView";
import { LazySection } from "@/components/LazySection";
import { VIDEO_PATHS, AIGC_CONCEPT_05 } from "@/data/works";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";

const navItems = [
  { label: "作品", href: "#works" },
  { label: "实验室", href: "#lab" },
  { label: "关于", href: "#about" },
];

const HERO_VIDEO = VIDEO_PATHS.hero;
const PROJECT_VIDEO = VIDEO_PATHS.zhongguohua;
const PROJECT_VIDEO_2 = VIDEO_PATHS.mianhuaShort;
const PROJECT_VIDEO_3 = VIDEO_PATHS.dianmian;
const PROJECT_VIDEO_4 = VIDEO_PATHS.yishourudan;
const PROJECT_VIDEO_5 = VIDEO_PATHS.project47;

/* 项目案例库数据 - 资源路径统一维护于 src/data/works.ts */
const projects = [
  {
    id: "aigc-dreamer",
    type: "ai" as const,
    title: "AIGC 商业视觉探索",
    subtitle: "《The Dreamer》",
    tags: ["#Veo", "#ComfyUI", "#Runway"],
    conceptImages: AIGC_CONCEPT_05,
    /* 图片未就绪时传空数组，避免 404；补齐对应目录下图片后可改为实际路径 */
    secondConceptImages: [] as { src: string; prompt?: string }[],
    thirdConceptImages: [] as { src: string; prompt?: string }[],
    fourthConceptImages: [] as { src: string; prompt?: string }[],
    fifthConceptImages: [] as { src: string; prompt?: string }[],
    videoSrc: PROJECT_VIDEO,
    secondVideoSrc: PROJECT_VIDEO_2,
    thirdVideoSrc: PROJECT_VIDEO_3,
    fourthVideoSrc: PROJECT_VIDEO_4,
    fifthVideoSrc: PROJECT_VIDEO_5,
  },
];

function ProjectBlock({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="section-block relative z-10 flex w-full flex-col items-center bg-transparent"
    >
        <div
        className={`mx-auto flex w-full max-w-5xl flex-col items-center px-3 transition-all duration-[1200ms] sm:px-6 md:px-8 ${
          isInView ? "animate-fade-in-view opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <header className="section-title-block section-title-to-content w-full">
          <h2 className="section-title-main">
            <span className="section-title-number">AIGC</span> 商业视觉探索
          </h2>
          <p className="section-title-en mt-1">
            | {project.subtitle}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="section-title-aux bg-transparent px-4 py-1.5 text-xs font-light uppercase tracking-[0.2em] opacity-70 transition-opacity hover:opacity-90"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* 内容区域：AI 全链路 */}
        <div className="section-img-wrapper flex w-full flex-col items-center justify-center">
            <AIFullChain
              conceptImages={project.conceptImages}
              videoSrc={project.videoSrc}
              secondVideoSrc={project.secondVideoSrc}
              secondConceptImages={"secondConceptImages" in project ? project.secondConceptImages : undefined}
              thirdConceptImages={"thirdConceptImages" in project ? project.thirdConceptImages : undefined}
              fourthConceptImages={"fourthConceptImages" in project ? project.fourthConceptImages : undefined}
              fifthConceptImages={"fifthConceptImages" in project ? project.fifthConceptImages : undefined}
              thirdVideoSrc={project.thirdVideoSrc}
              fourthVideoSrc={project.fourthVideoSrc}
              fifthVideoSrc={project.fifthVideoSrc}
            />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 避免 Hydration 报错：仅在客户端挂载后渲染含 linear-gradient 的遮罩
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        /* 某些浏览器需用户交互后才允许播放，静音自动播放通常可跳过 */
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-transparent">
      {/* 导航栏 - 毛玻璃效果 */}
      <header className="fixed left-0 right-0 top-0 z-50 bg-transparent backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-3 sm:px-6 md:px-8">
          {/* 左侧：头像 + 名字 */}
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-4"
          >
            {avatarError ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5E5E5]/20 text-sm font-bold text-[#E5E5E5] sm:h-11 sm:w-11">
                谢
              </div>
            ) : (
              <Image
                src={ensureAbsoluteImageSrc("/avatar.jpg")}
                alt="谢裕琪"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                priority
                onError={() => setAvatarError(true)}
              />
            )}
            <span className="text-base font-bold tracking-wide text-[#E5E5E5] sm:text-lg">
              谢裕琪
            </span>
          </Link>

          {/* 右侧：导航菜单 - 桌面端 */}
          <div className="hidden items-center gap-8 sm:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium tracking-wide text-[#E5E5E5]/80 transition-colors hover:text-[#E5E5E5]"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* 手机端：汉堡菜单按钮 */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#E5E5E5] transition-colors hover:bg-[#E5E5E5]/10 sm:hidden"
            aria-label="切换菜单"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* 手机端：下拉菜单 */}
        {menuOpen && (
          <div className="bg-transparent px-4 py-4 backdrop-blur-xl sm:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium tracking-wide text-[#E5E5E5]/80 transition-colors hover:bg-[#E5E5E5]/5 hover:text-[#E5E5E5]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - 全屏视频背景 */}
      <section className="relative z-[1] min-h-screen h-[100dvh] w-full overflow-hidden bg-black sm:h-screen">
        {/* 视频背景：移动端 object-contain 完整显示，桌面端 object-cover 铺满 */}
        <video
          ref={videoRef}
          className="absolute inset-0 z-[1] h-full w-full object-contain sm:object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls
        >
        </video>

        {/* 半透明深色遮罩：仅在客户端挂载后渲染，避免 Hydration 报错（含 linear-gradient 等易被扩展修改的样式） */}
        {isMounted && (
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        )}

        {/* 左下角：名字和 Slogan，绝对定位，从底部升起（高于流星层） */}
        <div className="absolute bottom-10 left-10 z-[4] flex flex-col gap-y-3 pl-2 pr-6 pb-2 sm:bottom-12 sm:left-12 sm:gap-y-4 sm:pl-4 lg:bottom-14 lg:left-14">
          <h1
            className="animate-rise-from-bottom text-4xl font-thin uppercase tracking-[0.15em] text-[#E5E5E5] sm:text-5xl md:text-6xl"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.25)" }}
          >
            谢裕琪 | XIEYUQI
          </h1>
          <p className="section-title-aux animate-rise-from-bottom-delay font-light text-base leading-relaxed opacity-80 sm:text-lg md:text-xl">
            3D 视觉表现 | AIGC 内容设计
          </p>
        </div>

        {/* 向下箭头 - 居中，超细线条，呼吸灯效果 */}
        <a
          href="#works"
          className="group absolute bottom-8 left-1/2 z-[4] flex -translate-x-1/2 flex-col items-center transition-opacity hover:opacity-100"
          aria-label="向下滚动"
        >
          <span
            className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5E5E5]/20 blur-md animate-breathe-glow group-hover:opacity-80"
            aria-hidden
          />
          <svg
            className="relative z-10 h-5 w-5 text-[#E5E5E5]/80 animate-breathe"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </section>

      <main id="works" className="relative z-10 w-full">
        <LazySection minHeight="min-h-[50vh]">
          <SpacePortfolioShowcase />
        </LazySection>

        {projects.map((project) => (
          <ProjectBlock key={project.id} project={project} />
        ))}

        <LazySection minHeight="min-h-[50vh]">
          <AIGCLabSection />
        </LazySection>

        <LazySection minHeight="min-h-[30vh]">
          <AIGCQuoteSection />
        </LazySection>
      </main>
    </div>
  );
}
