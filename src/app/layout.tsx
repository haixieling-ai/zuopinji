import type { Metadata } from "next";
import { MeteorBackground } from "@/components/MeteorBackground";
import { BackgroundLayers } from "@/components/BackgroundLayers";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

/* 使用系统字体栈，避免 next/font/google 在构建时联网请求 Google Fonts */
export const metadata: Metadata = {
  title: "谢裕琪 - 3D 视觉设计师 & AI 内容设计师",
  description: "谢裕琪的个人作品集",
  other: {
    "theme-color": "#000000",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="bg-transparent" suppressHydrationWarning>
      <body className="antialiased bg-transparent" suppressHydrationWarning>
        <BackgroundLayers />
        <MeteorBackground />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
