"use client";

import { useState, useRef, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  /** 进入视口后是否预加载元数据（可选） */
  preloadOnInView?: boolean;
  className?: string;
  aspectRatio?: "video" | "square";
  fallbackSrc?: string;
}

/** 占位封面 SVG（深色，无图时使用） */
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%230a0a0a' width='16' height='9'/%3E%3Ccircle cx='8' cy='4.5' r='1.5' fill='%23333'/%3E%3Cpath d='M6.5 3.5 L8 4.5 L6.5 5.5 Z' fill='%23555'/%3E%3C/svg%3E";

/**
 * 懒加载视频：默认显示封面，点击后加载并播放
 * 避免多视频同时加载导致卡顿
 */
export function LazyVideo({
  src,
  poster,
  preloadOnInView = false,
  className = "",
  aspectRatio = "video",
  fallbackSrc,
}: LazyVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [effectiveSrc, setEffectiveSrc] = useState(src);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (!shouldLoad) {
      setShouldLoad(true);
      setIsPlaying(true);
    } else {
      const v = videoRef.current;
      if (v) {
        if (v.paused) v.play();
        else v.pause();
      }
    }
  };

  useEffect(() => {
    if (!shouldLoad || !isPlaying) return;
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, [shouldLoad, isPlaying]);

  const displayPoster = poster || PLACEHOLDER_POSTER;
  const aspectClass = aspectRatio === "video" ? "aspect-video" : "aspect-square";

  return (
    <div
      ref={containerRef}
      data-cursor-invert
      className={`relative w-full overflow-hidden bg-[#0a0a0a] ${aspectClass} ${className}`}
    >
      {!shouldLoad ? (
        <button
          type="button"
          onClick={handleClick}
          className="absolute inset-0 flex h-full w-full items-center justify-center focus:outline-none"
          aria-label="点击播放视频"
        >
          <img
            src={displayPoster}
            alt="视频封面"
            className="h-full w-full object-cover"
          />
          <span
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 transition-opacity hover:bg-white/30"
            aria-hidden
          >
            <svg
              className="ml-1 h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      ) : (
        <div
          className={`flex h-full w-full cursor-pointer items-center justify-center ${aspectClass}`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          aria-label={isPlaying ? "暂停视频" : "播放视频"}
        >
          <video
            ref={videoRef}
            src={effectiveSrc}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload={preloadOnInView && isInView ? "metadata" : "none"}
            onEnded={() => {}}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              if (fallbackSrc && effectiveSrc !== fallbackSrc) {
                setEffectiveSrc(fallbackSrc);
              }
            }}
          />
          {!isPlaying && (
            <span
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20"
              aria-hidden
            >
              <svg
                className="ml-1 h-6 w-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
