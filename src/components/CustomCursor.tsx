"use client";

import { useEffect, useState } from "react";

const CURSOR_SIZE = 20;
const CURSOR_SIZE_HOVER = 40;

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isOverImage, setIsOverImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 避免 Hydration 报错：自定义光标仅在客户端渲染
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isImage =
        target.tagName === "IMG" ||
        target.closest("img") ||
        target.closest("[data-cursor-invert]");
      setIsOverImage(!!isImage);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOver);
    document.body.addEventListener("mouseleave", handleLeave);
    document.body.addEventListener("mouseenter", handleEnter);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOver);
      document.body.removeEventListener("mouseleave", handleLeave);
      document.body.removeEventListener("mouseenter", handleEnter);
    };
  }, [mounted, isVisible]);

  if (!mounted) return null;
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed mix-blend-difference"
      style={{
        zIndex: 9999,
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%)`,
        width: isOverImage ? CURSOR_SIZE_HOVER : CURSOR_SIZE,
        height: isOverImage ? CURSOR_SIZE_HOVER : CURSOR_SIZE,
        opacity: isVisible ? 1 : 0,
        transition: "width 0.2s ease-out, height 0.2s ease-out, opacity 0.15s ease-out",
      }}
      aria-hidden
    >
      <div
        className="h-full w-full rounded-full bg-white"
        style={{
          mixBlendMode: isOverImage ? "difference" : "difference",
        }}
      />
    </div>
  );
}
