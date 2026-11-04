"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Mic } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { linkVariants } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const transport = new DefaultChatTransport({
  api: "/api/consultant/chat",
});

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function errorMessage(error?: Error) {
  try {
    const body = JSON.parse(error?.message ?? "");
    if (typeof body?.error === "string" && body.error.trim()) return body.error;
  } catch {
    // Network failures and non-JSON bodies use the generic message.
  }
  return "The consultant is unavailable right now. Try again in a moment.";
}

function documentationUrl(url: string) {
  try {
    const parsed = new URL(url, "https://langfuse.com");
    if (parsed.username || parsed.password) return "";
    if (parsed.protocol === "https:" && parsed.hostname === "langfuse.com") {
      return parsed.href;
    }
    if (
      parsed.protocol === "https:" &&
      parsed.hostname === "github.com" &&
      parsed.pathname.startsWith("/langfuse/")
    ) {
      return parsed.href;
    }
    if (url.startsWith("/") && !url.startsWith("//")) return url;
    return "";
  } catch {
    return "";
  }
}

function PlanMarkdown({ text }: { text: string }) {
  return (
    <div className="text-left text-sm font-normal leading-[150%] tracking-[-0.07px] text-text-primary [&>*+*]:mt-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li+li]:mt-1 [&_h2]:font-analog [&_h2]:text-xl [&_h2]:font-medium [&_h3]:text-base [&_h3]:font-medium [&_blockquote]:border-l-2 [&_blockquote]:border-line-structure [&_blockquote]:pl-3 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-line-structure [&_pre]:bg-surface-1 [&_pre]:p-3 [&_code]:font-mono [&_code]:text-[12px] [&_th]:border [&_th]:border-line-structure [&_th]:bg-surface-1 [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-medium [&_td]:border [&_td]:border-line-structure [&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        allowedElements={[
          "p",
          "a",
          "strong",
          "em",
          "code",
          "br",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "blockquote",
          "pre",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
        ]}
        unwrapDisallowed
        urlTransform={documentationUrl}
        components={{
          a: ({ href, children }) =>
            href ? (
              <a href={href} className={linkVariants({ variant: "underline" })}>
                {children}
              </a>
            ) : (
              <span>{children}</span>
            ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}

function HaloMark({
  size,
  animate = false,
}: {
  size: number;
  animate?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 50"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse
        cx="27"
        cy="6"
        rx="10"
        ry="3"
        className={animate ? "consultant-halo-float" : undefined}
      />
      <path d="M19 16H35Q40 16 40 21V32Q40 37 35 37H21L14 44V21Q14 16 19 16Z" />
      <line x1="9" y1="26.5" x2="14" y2="26.5" />
      <line x1="40" y1="26.5" x2="45" y2="26.5" />
      <line x1="23.5" y1="24" x2="23.5" y2="28" />
      <line x1="30.5" y1="24" x2="30.5" y2="28" />
    </svg>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2.5" aria-hidden>
      <span className="text-text-primary">
        <HaloMark size={28} animate />
      </span>
      <span className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="consultant-halo-dot size-[5px] rounded-full bg-text-tertiary"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  );
}

const MAX_RECORDING_MS = 60_000;

function recordingMime() {
  if (typeof MediaRecorder === "undefined") return "";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  return "";
}

function ConsultantThread({ onNewChat }: { onNewChat: () => void }) {
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [dictationError, setDictationError] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat({
    transport,
  });
  const draftEpoch = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const discardRef = useRef(false);
  const busy = status === "submitted" || status === "streaming";
  const visible = messages.filter(
    (message) => message.role === "user" || message.role === "assistant",
  );

  function releaseMicrophone() {
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    return () => {
      discardRef.current = true;
      abortRef.current?.abort();
      if (recorderRef.current?.state === "recording")
        recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function transcribe(blob: Blob, epoch: number) {
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setTranscribing(true);
    try {
      const body = new FormData();
      const extension = blob.type.startsWith("audio/mp4") ? "m4a" : "webm";
      body.append("audio", blob, `turn.${extension}`);
      const response = await fetch("/api/consultant/transcribe", {
        method: "POST",
        body,
        signal: controller.signal,
      });
      const payload = (await response.json()) as {
        text?: string;
        error?: string;
      };
      if (epoch !== draftEpoch.current) return;
      if (
        !response.ok ||
        typeof payload.text !== "string" ||
        !payload.text.trim()
      ) {
        setDictationError(
          payload.error?.trim() ||
            "Dictation is unavailable right now. Try again in a moment.",
        );
        return;
      }
      setDraft((current) => {
        const spoken = payload.text!.trim();
        const next = current.trim()
          ? `${current.replace(/\s+$/, "")} ${spoken}`
          : spoken;
        return next.slice(0, 4000);
      });
    } catch (caught) {
      if (epoch !== draftEpoch.current) return;
      if (caught instanceof DOMException && caught.name === "AbortError")
        return;
      setDictationError(
        "Dictation is unavailable right now. Try again in a moment.",
      );
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      if (epoch === draftEpoch.current) setTranscribing(false);
    }
  }

  async function toggleDictation() {
    if (transcribing) return;
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setDictationError("This browser cannot use the microphone.");
      return;
    }
    setDictationError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = recordingMime();
      const recorder = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined,
      );
      const chunks: Blob[] = [];
      const epoch = draftEpoch.current;
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks, {
          type: recorder.mimeType || mime || "audio/webm",
        });
        releaseMicrophone();
        if (discardRef.current) return;
        setRecording(false);
        void transcribe(blob, epoch);
      });
      recorderRef.current = recorder;
      streamRef.current = stream;
      recorder.start();
      setRecording(true);
      window.setTimeout(() => {
        if (
          recorderRef.current === recorder &&
          recorder.state === "recording"
        ) {
          recorder.stop();
        }
      }, MAX_RECORDING_MS);
    } catch {
      releaseMicrophone();
      setRecording(false);
      setDictationError("Allow the microphone to dictate.");
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy || recording || transcribing) return;
    draftEpoch.current += 1;
    abortRef.current?.abort();
    setDraft("");
    setDictationError("");
    void sendMessage({ text });
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const empty = visible.length === 0 && !error;
  const showThinking =
    busy &&
    !visible.some(
      (message) => message.role === "assistant" && messageText(message),
    );

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col items-center px-6",
        empty ? "justify-center py-16" : "py-8",
      )}
    >
      <style>{`
        @keyframes consultant-halo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2.5px); }
        }
        .consultant-halo-float { animation: consultant-halo-float 2.8s ease-in-out infinite; }
        @keyframes consultant-halo-dot {
          0%, 80%, 100% { opacity: 0.25; }
          40% { opacity: 1; }
        }
        .consultant-halo-dot { animation: consultant-halo-dot 1.2s ease-in-out infinite; }
      `}</style>
      <div
        className={cn(
          "flex w-full max-w-[680px] flex-col gap-8",
          !empty && "min-h-0 flex-1",
        )}
      >
        {empty && (
          <header className="flex flex-col items-center gap-5 text-center">
            <span className="text-text-primary">
              <HaloMark size={72} animate />
            </span>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-[18px] bg-line-divider-dash" />
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-text-tertiary">
                Halo
              </span>
              <span className="h-px w-[18px] bg-line-divider-dash" />
            </div>
            <h1 className="m-0 max-w-[18ch] text-balance font-analog text-[34px] font-medium leading-[115%] tracking-[-0.01em] text-text-primary">
              Tell me about the agent you&apos;re building.
            </h1>
            <Text
              size="m"
              className="max-w-[500px] text-pretty text-base leading-[150%] text-text-secondary"
            >
              I&apos;ll help you figure out your plan for how to best observe
              and improve your agent.
            </Text>
          </header>
        )}
        {!empty && (
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="flex flex-col gap-4 px-0 py-2">
              {visible.map((message) => {
                const text = messageText(message);
                const isUser = message.role === "user";
                if (!text) return null;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    {isUser ? (
                      <p className="max-w-[80%] whitespace-pre-wrap rounded-[2px] border border-line-structure bg-surface-1 px-3.5 py-2.5 text-left text-sm leading-[150%] text-text-primary">
                        {text}
                      </p>
                    ) : (
                      <div className="w-full max-w-[42rem]">
                        <PlanMarkdown text={text} />
                      </div>
                    )}
                  </div>
                );
              })}
              {showThinking && <ThinkingDots />}
              {error && (
                <Text size="s" className="text-left" role="alert">
                  {errorMessage(error)}
                </Text>
              )}
            </ConversationContent>
          </Conversation>
        )}
        <form onSubmit={submit} className="shrink-0">
          <label htmlFor="consultant-message" className="sr-only">
            Describe your AI application
          </label>
          <CornerBox className="bg-surface-bg shadow-[-1px_1px_1px_rgba(0,0,0,0.02),-2px_3px_4px_rgba(0,0,0,0.03),-4px_8px_14px_rgba(0,0,0,0.03)]">
            <textarea
              id="consultant-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              maxLength={4000}
              rows={3}
              placeholder="e.g. A support agent on LangGraph that calls 6 tools and answers billing questions…"
              className="block w-full resize-none border-0 bg-transparent px-4 pb-2 pt-4 font-sans text-[15px] leading-[150%] text-text-primary outline-none placeholder:text-text-disabled focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-3 px-4 pb-2.5 pt-2">
              <div className="flex min-w-0 items-center gap-3">
                {visible.length > 0 && (
                  <Button
                    type="button"
                    variant="text"
                    size="small"
                    aria-label="New chat"
                    className="w-auto shrink-0 text-text-tertiary"
                    onClick={() => {
                      void stop();
                      onNewChat();
                    }}
                  >
                    New chat
                  </Button>
                )}
                <span className="hidden min-w-0 truncate font-mono text-[11px] text-text-disabled sm:inline">
                  {recording
                    ? "Listening… click the microphone to stop"
                    : transcribing
                      ? "Transcribing…"
                      : "Enter to send · Shift + Enter for new line"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
                  icon={<Mic className="size-3.5" />}
                  aria-label={recording ? "Stop dictation" : "Dictate"}
                  aria-pressed={recording}
                  disabled={transcribing}
                  wrapperClassName="p-0"
                  className={
                    recording
                      ? "border-line-cta bg-surface-cta-primary text-text-primary"
                      : undefined
                  }
                  onClick={() => void toggleDictation()}
                />
                {busy ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="default"
                    aria-label="Stop"
                    wrapperClassName="p-0"
                    onClick={() => void stop()}
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="default"
                    aria-label="Send"
                    disabled={!draft.trim() || recording || transcribing}
                    wrapperClassName="p-0"
                    className="h-8 w-auto gap-2 border-line-cta bg-surface-cta-primary pl-3 pr-2 text-[14px] font-medium text-text-primary shadow-none hover:bg-surface-cta-primary"
                  >
                    Send
                    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[2px] border border-line-cta px-1 font-mono text-[10px] leading-none">
                      ↵
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </CornerBox>
          {dictationError && (
            <Text size="s" className="mt-2 text-left" role="alert">
              {dictationError}
            </Text>
          )}
        </form>
      </div>
    </div>
  );
}

export function ConsultantChat() {
  const [chatKey, setChatKey] = useState(0);
  return (
    <ConsultantThread
      key={chatKey}
      onNewChat={() => setChatKey((key) => key + 1)}
    />
  );
}
