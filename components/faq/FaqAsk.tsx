"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { linkVariants } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Markdown from "react-markdown";
import styles from "./FaqAsk.module.css";

const transport = new DefaultChatTransport({
  api: "/api/faq-bot",
  prepareSendMessagesRequest: ({ messages }) => ({
    body: {
      question:
        messages
          .at(-1)
          ?.parts.filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("") ?? "",
    },
  }),
});

// Model output never enables raw HTML, images, or arbitrary external links.
function documentationUrl(url: string) {
  try {
    const parsed = new URL(url, "https://langfuse.com");
    return parsed.protocol === "https:" &&
      parsed.hostname === "langfuse.com" &&
      !parsed.username &&
      !parsed.password
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

function AskForm({ linked = false }: { linked?: boolean }) {
  const id = useId();
  const [phase, setPhase] = useState<
    "idle" | "editing" | "loading" | "answered"
  >("idle");
  const [question, setQuestion] = useState("");
  const [focused, setFocused] = useState(false);
  const { messages, sendMessage, setMessages, stop, error, clearError } =
    useChat({
      transport,
      onFinish: () => setPhase("answered"),
      onError: () => setPhase("answered"),
    });
  const answer = messages
    .filter((message) => message.role === "assistant")
    .flatMap((message) => message.parts)
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n\n");
  const input = useRef<HTMLTextAreaElement>(null);
  const loading = phase === "loading";
  const showDraftCursor = phase === "editing" && !focused && !!question.trim();
  // Accordion questions inherit Analog from Radix's h3; match it explicitly here.
  // Linked items keep the surrounding docs typography.
  // Keep the invitation and editable question identical in every state.
  const questionTypography = linked
    ? "text-[length:inherit] font-normal leading-[inherit]"
    : "font-analog text-[15px] font-medium leading-snug";

  useEffect(
    () => () => {
      void stop();
    },
    [stop],
  );

  useEffect(() => {
    if (phase === "editing") input.current?.focus();
  }, [phase]);

  useLayoutEffect(() => {
    const textarea = input.current;
    if (!textarea) return;
    function resize() {
      textarea.style.height = "1lh";
      if (textarea.scrollHeight > 0) {
        // scrollHeight rounds to whole pixels; retain the same fractional
        // line height as the invitation instead of adding a pixel on focus.
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
        const lines = Math.max(
          1,
          Math.round(textarea.scrollHeight / lineHeight),
        );
        textarea.style.height = `${lines * lineHeight}px`;
      }
    }
    resize();
    let width = textarea.clientWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth === width) return;
      width = textarea.clientWidth;
      resize();
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [question, phase]);

  function newQuestion() {
    void stop();
    setMessages([]);
    clearError();
    setQuestion("");
    setPhase("editing");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || phase !== "editing") return;
    const submitted = question.trim();
    setPhase("loading");
    setQuestion(submitted);
    void sendMessage({ text: submitted });
  }

  return (
    <div className={cn("not-prose flex flex-col", !linked && "py-5")}>
      {phase === "idle" ? (
        <button
          type="button"
          onClick={() => setPhase("editing")}
          className={cn(
            "inline-flex self-start items-baseline gap-1 text-left cursor-text rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            linked
              ? linkVariants({ variant: "underline" })
              : "text-text-primary",
            questionTypography,
          )}
        >
          Ask anything else
          <span aria-hidden="true" className={styles.cursor} />
        </button>
      ) : (
        <form onSubmit={submit}>
          <label htmlFor={id} className="sr-only">
            Your question
          </label>
          <div className={cn("flex items-start gap-2", questionTypography)}>
            <div
              className={cn(
                "relative min-w-0 flex-1",
                linked ? "text-text-links" : "text-text-primary",
                questionTypography,
              )}
            >
              <textarea
                ref={input}
                id={id}
                rows={1}
                maxLength={500}
                value={question}
                readOnly={phase !== "editing"}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  if (phase === "editing" && !question.trim()) {
                    setQuestion("");
                    setPhase("idle");
                  }
                }}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                className={cn(
                  "block h-[1lh] w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                  showDraftCursor && "opacity-0",
                  questionTypography,
                )}
              />
              {showDraftCursor && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words"
                >
                  {question}
                  <span className={styles.cursor} />
                </div>
              )}
            </div>
            {/* Keep the row one line tall without squeezing the button's corners. */}
            <div className="flex h-[1lh] shrink-0 items-center">
              {phase === "answered" ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={newQuestion}
                  aria-label="New question"
                  wrapperClassName="shrink-0"
                >
                  New question
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  size="small"
                  aria-label="Ask question"
                  disabled={!question.trim() || loading}
                  wrapperClassName="shrink-0"
                >
                  {loading ? "Answering…" : "Ask"}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
      <div aria-live="polite" aria-busy={loading}>
        {loading && !answer && (
          <Text size="s" className="mt-2 text-left">
            Finding an answer…
          </Text>
        )}
        {!loading && (error || (phase === "answered" && !answer)) && (
          <Text size="s" className="mt-2 text-left" role="alert">
            I couldn’t get an answer right now. Please try a new question in a
            moment.
          </Text>
        )}
        {answer && !error && (
          <div className="pt-2">
            <div className="pr-8 text-sm text-left font-normal leading-[150%] tracking-[-0.07px] text-text-tertiary [&_p+p]:mt-2">
              <Markdown
                skipHtml
                allowedElements={["p", "a", "strong", "em", "code", "br"]}
                unwrapDisallowed
                urlTransform={documentationUrl}
                components={{
                  a: ({ href, children }) =>
                    href ? (
                      <a
                        href={href}
                        className={linkVariants({ variant: "underline" })}
                      >
                        {children}
                      </a>
                    ) : (
                      <span>{children}</span>
                    ),
                }}
              >
                {answer}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FaqAsk({ linked = false }: { linked?: boolean }) {
  if (linked) {
    return (
      <li className="my-2">
        <AskForm linked />
      </li>
    );
  }

  // Borders wrap the complete question and answer, exactly one FAQ item.
  return (
    <div className="border-y border-line-structure">
      <AskForm />
    </div>
  );
}
