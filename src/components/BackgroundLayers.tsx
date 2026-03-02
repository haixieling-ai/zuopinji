"use client";

import { useEffect, useState } from "react";

/**
 * 背景质感层：极深灰径向渐变 + 氛围光晕（30s 呼吸动画）+ 胶片噪点
 * 仅在客户端挂载后渲染，避免 Hydration 报错（radial-gradient 动画不在服务端生成）
 */
export function BackgroundLayers() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 避免 Hydration 报错：radial-gradient 仅在客户端生成
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  /* 严禁在服务端渲染 radial-gradient，仅在客户端挂载后生成，根治 Hydration 报错 */
  if (!isMounted) return <div className="fixed inset-0 -z-[5] bg-black" aria-hidden />;

  return (
    <>
      {/* 极深灰到黑径向渐变 - 最底层 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -3,
          background:
            "radial-gradient(ellipse 120% 100% at 50% 30%, #0d0d0d 0%, #0a0a0a 50%, #000000 100%)",
        }}
        aria-hidden
      />
      {/* 氛围光晕 1：左上深蓝，在渐变之上 */}
      <div
        className="pointer-events-none fixed inset-0 animate-light-leak-1"
        style={{
          zIndex: -2,
          background:
            "radial-gradient(ellipse 150% 150% at 5% 5%, rgba(25, 45, 80, 0.85) 0%, rgba(12, 22, 40, 0.4) 40%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* 氛围光晕 2：右下极暗紫/暖橙 */}
      <div
        className="pointer-events-none fixed inset-0 animate-light-leak-2"
        style={{
          zIndex: -2,
          background:
            "radial-gradient(ellipse 150% 150% at 95% 95%, rgba(50, 25, 45, 0.8) 0%, rgba(22, 12, 20, 0.4) 40%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* 胶片噪点 - 极弱纸张纹理感，降低马赛克感 */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.012]"
        style={{
          zIndex: 9998,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />
    </>
  );
}
