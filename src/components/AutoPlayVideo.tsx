"use client";

import { useEffect, useRef } from "react";

interface AutoPlayVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

/** 进入视口自动播放，离开视口暂停，保持 muted 以符合浏览器策略 */
export function AutoPlayVideo({ src, ...props }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25, rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="aspect-video w-full">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        controls
        className="h-full w-full object-cover"
        {...props}
      />
    </div>
  );
}
