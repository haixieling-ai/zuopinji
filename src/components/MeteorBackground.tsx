"use client";

import { useEffect, useRef, useState } from "react";

/* 流星数量：5-8 颗，保持适度稀疏 */
const METEOR_COUNT = 6;

class Meteor {
  x = 0;
  y = 0;
  len = 0;
  speed = 0;
  opacity = 1;

  constructor(private canvas: HTMLCanvasElement) {
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width + 300; // 从右侧进入
    this.y = Math.random() * -this.canvas.height; // 从上方进入
    this.len = Math.random() * 35 + 30; // 流星长度
    this.speed = Math.random() * 2.5 + 3.5; // 极慢：约 6-10 秒划过
    this.opacity = 0.35; // 半透明银灰，可见但不过分抢眼
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - this.len,
      this.y + this.len
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.save();
    ctx.filter = "blur(0.5px)";
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y + this.len);
    ctx.stroke();
    ctx.restore();
  }

  update() {
    this.x -= this.speed;
    this.y += this.speed;
    if (this.y > this.canvas.height || this.x < 0) {
      this.reset();
    }
  }
}

export function MeteorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 避免 Hydration 报错：canvas 与 Math.random 仅在客户端渲染
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const meteors: Meteor[] = Array.from({ length: METEOR_COUNT }, () => new Meteor(canvas));

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      meteors.forEach((m) => {
        m.update();
        m.draw(ctx);
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [isMounted]);

  /* 严禁在服务端渲染 canvas/随机样式，仅在客户端挂载后渲染，根治 Hydration 报错 */
  if (!isMounted) return <div className="fixed inset-0 -z-[5] bg-black" aria-hidden />;

  return (
    <canvas
      ref={canvasRef}
      id="meteorCanvas"
      className="meteor-canvas"
      aria-hidden
      suppressHydrationWarning
    />
  );
}
