"use client";

import { useInView } from "./useInView";

interface LazySectionProps {
  children: React.ReactNode;
  /** 占位高度，避免布局偏移（如 "min-h-[60vh]"） */
  minHeight?: string;
  className?: string;
}

/**
 * 懒渲染区块：进入视口后再渲染子内容，减少首屏 DOM 与资源加载
 */
export function LazySection({
  children,
  minHeight = "min-h-[40vh]",
  className = "",
}: LazySectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.05, rootMargin: "100px 0px" });

  return (
    <div ref={ref} className={`${!isInView ? minHeight : ""} ${className}`}>
      {isInView ? children : null}
    </div>
  );
}
