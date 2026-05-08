"use client";

import { useState, useMemo } from "react";
import type { HTMLAttributes, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import {
  Suggestions,
  Suggestion,
} from "@/components/ai-elements/suggestion";
import { Image as AiImage } from "@/components/ai-elements/image";
import { LangfuseWeb } from "langfuse";
import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";
import {
  SendIcon,
  DownloadIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";

const eulangfuseWebClient = new LangfuseWeb({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
});

const usLangfuseWebClient = new LangfuseWeb({
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
});

const jpLangfuseWebClient = new LangfuseWeb({
  publicKey: process.env.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL,
});

type GeneratedImage = {
  base64: string;
  mediaType: string;
  prompt: string;
  traceId: string;
};

const EXAMPLE_PROMPTS = [
  "A sunset over mountains in watercolor style",
  "A futuristic city with neon lights at night",
  "A cat wearing a space helmet floating in space",
];

type ImageGeneratorProps = HTMLAttributes<HTMLDivElement>;

export const ImageGenerator = ({
  className,
  ...props
}: ImageGeneratorProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<number | null>(null);

  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getPersistedNanoId({
      key: "image-generator-user-id",
      prefix: "u-",
    });
  }, []);

  const handleSubmit = async (prompt?: string) => {
    const textPrompt = prompt ?? input;
    if (!textPrompt.trim() || !userId) return;

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/image-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textPrompt, userId }),
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setCurrentImage({
        base64: data.image.base64,
        mediaType: data.image.mediaType,
        prompt: textPrompt,
        traceId: data.traceId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = `data:${currentImage.mediaType};base64,${currentImage.base64}`;
    link.download = `langfuse-demo-${Date.now()}.png`;
    link.click();
  };

  const handleFeedback = (value: number) => {
    if (!currentImage) return;
    setFeedback(value);
    for (const client of [eulangfuseWebClient, usLangfuseWebClient, jpLangfuseWebClient]) {
      client.score({
        traceId: currentImage.traceId,
        id: `user-feedback-${currentImage.traceId}`,
        name: "user-feedback",
        value,
      });
    }
  };

  return (
    <div className={cn("h-[62vh]", className)} {...props}>
      <div className="flex flex-col h-full rounded-[2px] border border-line-structure bg-surface-bg corner-box-corners p-5 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto relative z-10 space-y-4">
          {/* Prompt input */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 px-3 py-2 rounded-[2px] border border-line-structure bg-surface-bg text-text-secondary text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-line-cta"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] border border-line-structure bg-text-primary text-surface-bg text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? (
                  <Loader size={14} />
                ) : (
                  <SendIcon className="size-4" />
                )}
                Generate
              </button>
            </div>
          </form>

          {/* Example prompts */}
          {!currentImage && !loading && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try an example:</p>
              <Suggestions>
                {EXAMPLE_PROMPTS.map((prompt, i) => (
                  <Suggestion
                    key={i}
                    suggestion={prompt}
                    onClick={(s) => {
                      setInput(s);
                      handleSubmit(s);
                    }}
                    className="text-xs"
                  >
                    {prompt}
                  </Suggestion>
                ))}
              </Suggestions>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-64 h-64 rounded-lg bg-muted animate-pulse mb-4" />
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader size={16} />
                Generating image... This may take up to 30 seconds.
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Generated image */}
          {currentImage && !loading && (
            <div className="space-y-3">
              <div className="p-3 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Prompt: </span>
                {currentImage.prompt}
              </div>

              <div className="flex justify-center">
                <AiImage
                  base64={currentImage.base64}
                  mediaType={currentImage.mediaType}
                  uint8Array={new Uint8Array()}
                  alt={currentImage.prompt}
                  className="max-w-md rounded-[2px] border border-line-structure"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <DownloadIcon className="size-3.5" />
                  Download
                </button>
                <div className="w-px h-4 bg-line-structure" />
                <span className="text-xs text-muted-foreground">
                  Rate this:
                </span>
                <button
                  onClick={() => handleFeedback(1)}
                  className={cn(
                    "p-1.5 rounded-[2px] transition-colors",
                    feedback === 1
                      ? "text-green-700 dark:text-green-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <ThumbsUpIcon className="size-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback(0)}
                  className={cn(
                    "p-1.5 rounded-[2px] transition-colors",
                    feedback === 0
                      ? "text-red-700 dark:text-red-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <ThumbsDownIcon className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center relative z-10 italic">
          Powered by GPT-Image-1. Limited to 3 generations per minute. All interactions are traced in the public example project.
        </p>
      </div>
    </div>
  );
};
