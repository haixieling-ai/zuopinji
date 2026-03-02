"use client";

import { useState, useCallback, useEffect } from "react";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";
import { useInView } from "@/components/useInView";

const PREVIEW_LINES = 12;

const workflows = [
  {
    id: "v1",
    title: "商业级车漆渲染增强流 (Flux + SDXL)",
    description: "Flux 与 SDXL 商业级影像流",
    imagePath: "/workflows/dreamer-v1.png",
    jsonPath: "/workflows/dreamer-v1.json",
  },
  {
    id: "v2",
    title: "影视级角色一致性逻辑 (The Last Breath 项目)",
    description: "角色一致性与影视级输出",
    imagePath: "/workflows/dreamer-v2.png",
    jsonPath: "/workflows/dreamer-v2.json",
  },
  {
    id: "v3",
    title: "动态分镜视觉推演流 (The Dreamer 专案)",
    description: "分镜推演与视觉叙事",
    imagePath: "/workflows/dreamer-v3.png",
    jsonPath: "/workflows/dreamer-v3.json",
  },
  {
    id: "v4",
    title: "复杂材质纹理精修工作流 (3ds Max 联动专用)",
    description: "材质纹理与 3D 联动",
    imagePath: "/workflows/dreamer-v4.png",
    jsonPath: "/workflows/dreamer-v4.json",
  },
];

function highlightJson(raw: string) {
  return raw
    .replace(/"([^"]+)":/g, '<span class="text-[#c678dd]">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="text-[#98c379]">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-[#d19a66]">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="text-[#56b6c2]">$1</span>');
}

function getPreviewJson(full: string) {
  const lines = full.split("\n");
  if (lines.length <= PREVIEW_LINES) return full;
  return lines.slice(0, PREVIEW_LINES).join("\n") + "\n  // ...";
}

function getFilename(jsonPath: string) {
  return jsonPath.split("/").pop() ?? "workflow.json";
}

interface WorkflowCardProps {
  workflow: (typeof workflows)[number];
  onImageClick: (imagePath: string) => void;
}

function WorkflowCard({ workflow, onImageClick }: WorkflowCardProps) {
  const [jsonContent, setJsonContent] = useState<string>("");
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const absoluteJsonPath = ensureAbsoluteImageSrc(workflow.jsonPath);

  useEffect(() => {
    fetch(absoluteJsonPath)
      .then((r) => r.text())
      .then(setJsonContent)
      .catch(() => setJsonContent('{ "error": "Failed to load workflow" }'));
  }, [absoluteJsonPath]);

  const handleCopy = useCallback(async () => {
    if (!jsonContent) return;
    try {
      await navigator.clipboard.writeText(jsonContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback ignored
    }
  }, [jsonContent]);

  const displayJson = showFull ? jsonContent : getPreviewJson(jsonContent);
  const filename = getFilename(workflow.jsonPath);

  return (
    <div
      className="flex flex-col overflow-hidden bg-transparent"
    >
      {/* Mac 风格窗口标题栏 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-medium text-[#E5E5E5]">{workflow.title}</p>
          <p className="section-title-aux text-xs opacity-70">{workflow.description}</p>
        </div>
      </div>

      {/* 工作流截图 - 固定高度 */}
      <div
        data-cursor-invert
        className="group relative aspect-video w-full cursor-zoom-in overflow-hidden bg-transparent"
        onClick={() => onImageClick(workflow.imagePath)}
      >
        {imgError ? (
          <div className="section-title-aux flex h-full w-full items-center justify-center text-sm opacity-60">
            工作流截图 {workflow.imagePath}
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={ensureAbsoluteImageSrc(workflow.imagePath)}
            alt={workflow.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            onError={() => setImgError(true)}
          />
        )}
        <div className="section-title-aux absolute bottom-2 right-2 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-80">
          点击放大查看节点
        </div>
      </div>

      {/* JSON 预览区 */}
      <div
        className={`flex-1 overflow-auto p-4 ${!showFull ? "max-h-[200px]" : "max-h-[280px]"}`}
      >
        <p className="section-title-aux mb-2 font-mono text-xs opacity-70">{filename}</p>
        <pre className="font-mono text-xs leading-relaxed text-[#E5E5E5]">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightJson(
                displayJson.replace(/</g, "&lt;").replace(/>/g, "&gt;")
              ),
            }}
          />
        </pre>
      </div>

      {/* View Full JSON 展开/收起 */}
      {jsonContent && jsonContent.split("\n").length > PREVIEW_LINES && (
        <button
          type="button"
          onClick={() => setShowFull(!showFull)}
          className="section-title-aux px-4 py-2 text-left text-xs leading-relaxed opacity-80 transition-opacity hover:opacity-100"
        >
          {showFull ? "收起" : "View Full JSON"}
        </button>
      )}

      {/* 底部按钮 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={handleCopy}
          className="section-title-aux rounded-sm px-3 py-1.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
        >
          {copied ? "复制成功" : "Copy JSON"}
        </button>
        <a
          href={absoluteJsonPath}
          download={filename}
          className="section-title-aux flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </a>
      </div>
    </div>
  );
}

export function AIGCLabSection() {
  const { ref, isInView } = useInView();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <section
      id="lab"
      ref={ref}
      className="section-block flex w-full flex-col items-center bg-transparent"
    >
      <div
        className={`mx-auto flex w-full max-w-5xl flex-col items-center bg-transparent px-3 transition-all duration-[1200ms] ease-out sm:px-6 md:px-8 ${
          isInView ? "animate-fade-in-view opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <header className="section-title-block section-title-to-content w-full">
          <h2 className="section-title-main">
            <span className="section-title-number">AIGC</span> 实验室
          </h2>
          <p className="section-title-en mt-1">
            | AIGC LAB
          </p>
        </header>

        {/* 网格布局：PC 两列 / 手机单列 */}
        <div className="grid w-full grid-cols-1 gap-6 bg-transparent md:grid-cols-2">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onImageClick={(path) => setFullscreenImage(ensureAbsoluteImageSrc(path))}
            />
          ))}
        </div>
      </div>

      {/* 全屏图片模态框 */}
      {fullscreenImage && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-[#000000]/95 p-4"
          onClick={() => setFullscreenImage(null)}
          aria-label="关闭全屏"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ensureAbsoluteImageSrc(fullscreenImage)}
            alt="ComfyUI 工作流全屏查看"
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}
    </section>
  );
}
