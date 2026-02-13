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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to generate image");
      }

      const data = await res.json();
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
    for (const client of [eulangfuseWebClient, usLangfuseWebClient]) {
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
      <div className="flex flex-col h-full border border-border/40 rounded-2xl bg-gradient-to-br from-background via-background/95 to-muted/20 backdrop-blur-md shadow-xl shadow-black/10 dark:shadow-black/30 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-transparent before:pointer-events-none">
        <div className="flex-1 overflow-y-auto relative z-10 space-y-4">
          {/* Prompt input */}
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Prompt: </span>
                {currentImage.prompt}
              </div>

              <div className="flex justify-center">
                <AiImage
                  base64={currentImage.base64}
                  mediaType={currentImage.mediaType}
                  uint8Array={new Uint8Array()}
                  alt={currentImage.prompt}
                  className="max-w-md rounded-lg shadow-lg"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <DownloadIcon className="size-3.5" />
                  Download
                </button>
                <div className="w-px h-4 bg-border" />
                <span className="text-xs text-muted-foreground">
                  Rate this:
                </span>
                <button
                  onClick={() => handleFeedback(1)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    feedback === 1
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <ThumbsUpIcon className="size-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback(0)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    feedback === 0
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
