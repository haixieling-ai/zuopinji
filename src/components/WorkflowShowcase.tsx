"use client";

import { useState, useCallback } from "react";
import { ensureAbsoluteImageSrc } from "@/lib/imagePath";

const SAMPLE_JSON = `{
  "last_node_id": 9,
  "last_link_id": 9,
  "nodes": [
    {
      "id": 1,
      "type": "KSampler",
      "pos": [100, 200],
      "size": [300, 262],
      "inputs": ["model", "positive", "negative"],
      "widgets_values": [1, 20, 0.8, 0.5, "randomize", 12345]
    },
    {
      "id": 2,
      "type": "CheckpointLoaderSimple",
      "pos": [100, 0],
      "outputs": ["MODEL", "CLIP", "VAE"],
      "widgets_values": ["v1-5-pruned-ema.safetensors"]
    }
  ],
  "links": [
    [1, 2, 0, 0, "MODEL", "model", "MODEL"]
  ]
}`;

function highlightJson(raw: string) {
  return raw
    .replace(/"([^"]+)":/g, '<span class="text-[#c678dd]">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="text-[#98c379]">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-[#d19a66]">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="text-[#56b6c2]">$1</span>');
}

interface WorkflowShowcaseProps {
  imageSrc?: string;
  jsonContent?: string;
  filename?: string;
}

export function WorkflowShowcase({
  imageSrc = "/lab/workflow-01.png",
  jsonContent = SAMPLE_JSON,
  filename = "workflow_v1.0.json",
}: WorkflowShowcaseProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback ignored
    }
  }, [jsonContent]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonContent, filename]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
      {/* 左侧：节点截图 */}
      <div className="flex-1 shrink-0 lg:min-w-0">
        <div data-cursor-invert className="overflow-hidden bg-transparent">
          <div className="flex aspect-video w-full items-center justify-center bg-transparent lg:aspect-[4/3]">
            {imgError ? (
              <span className="text-sm text-white/40">工作流截图占位 /lab/workflow-01.png</span>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={ensureAbsoluteImageSrc(imageSrc)}
                alt="ComfyUI 工作流节点"
                className="h-full w-full object-contain"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 右侧：代码展示区 */}
      <div className="flex min-w-0 flex-1 flex-col lg:min-w-[420px]">
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mac 风格窗口标题栏 */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
            </div>
            <span className="font-mono text-sm text-white/70">{filename}</span>
          </div>

          {/* JSON 内容区 */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="font-mono text-sm leading-relaxed text-white/90">
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightJson(
                    jsonContent
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                  ),
                }}
              />
            </pre>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-sm px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white/80"
            >
              {copied ? "已复制" : "Copy JSON"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white/80"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
