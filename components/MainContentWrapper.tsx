"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useConfig } from "@/lib/nextra-shim/theme-docs";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";
import { Button } from "./ui/button";
import {
  Copy as CopyIcon,
  Check as CheckIcon,
  LifeBuoy,
  ThumbsDown,
  ThumbsUp,
  ChevronDown,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { NotebookBanner } from "./NotebookBanner";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "./ui/dialog";
import { CustomerStoryCTA } from "./customers/CustomerStoryCTA";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import IconChatGPT from "./icons/chatgpt";
import IconClaude from "./icons/claude";
import IconMCP from "./icons/mcp";

const pathsWithoutFooterWidgets = [
  "/imprint",
  "/blog",
  "/users",
  "/support",
  "/about",
  "/careers",
  "/press",
  "/watch-demo",
];
const pathsWithCopyAsMarkdownButton = [
  "/docs",
  "/self-hosting",
  "/guide",
  "/faq",
  "/integrations",
  "/handbook",
  "/security",
];
const isCustomerStory = (pathname: string) =>
  pathname.startsWith("/users/");

export const CopyMarkdownButton = () => {
  const pathname = usePathname();
  const capture = usePostHogClientCapture();
  const [copyState, setCopyState] = useState<
    "idle" | "loading" | "copied" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("Error Copying");
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const getMarkdownUrl = () => {
    let basePath = pathname ?? "";
    if (basePath.startsWith("/")) basePath = basePath.substring(1);
    if (basePath.endsWith("/")) basePath = basePath.slice(0, -1);
    if (!basePath) basePath = "index"; // Handle root index page
    return `/${basePath}.md`;
  };

  const getMarkdownFullUrl = () => {
    if (typeof window === "undefined") return "";
    const mdPath = getMarkdownUrl();
    return `${window.location.origin}${mdPath}`;
  };

  const handleCopy = async () => {
    // Clear any existing timeout before starting a new operation
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    setCopyState("loading");
    setErrorMessage("");

    capture("copy_page", { type: "copy" });

    const mdUrl = getMarkdownUrl();

    try {
      const response = await fetch(mdUrl, {
        headers: { Accept: "text/markdown" },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("Source Files Not Found");
        } else {
          setErrorMessage("Fetch Error");
        }
        setCopyState("error");
        timeoutIdRef.current = setTimeout(() => {
          setCopyState("idle");
          timeoutIdRef.current = null;
        }, 3000);
        return;
      }
      const markdown = await response.text();

      await navigator.clipboard.writeText(markdown);
      setCopyState("copied");
      timeoutIdRef.current = setTimeout(() => {
        setCopyState("idle");
        timeoutIdRef.current = null;
      }, 2000);
    } catch (error: any) {
      console.error("Failed to copy markdown:", error);
      if (
        error?.name === "NotAllowedError" ||
        error?.name === "SecurityError"
      ) {
        setErrorMessage("Clipboard Permission Denied");
      } else {
        setErrorMessage("Copy Error");
      }
      setCopyState("error");
      timeoutIdRef.current = setTimeout(() => {
        setCopyState("idle");
        timeoutIdRef.current = null;
      }, 3000);
    }
  };

  const getChatGPTUrl = () => {
    const mdUrl = getMarkdownFullUrl();
    const prompt = `Read from ${mdUrl} so I can ask questions about it.`;
    return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`;
  };

  const getClaudeUrl = () => {
    const mdUrl = getMarkdownFullUrl();
    const prompt = `Read from ${mdUrl} so I can ask questions about it.`;
    return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
  };

  const handleChatGPTClick = () => {
    capture("copy_page", { type: "chatgpt" });
  };

  const handleClaudeClick = () => {
    capture("copy_page", { type: "claude" });
  };

  const isDisabled = copyState === "loading" || copyState === "copied";
  const isError = copyState === "error";

  // Self-guard: only render on pages that should have the copy button.
  // All hooks are above so this conditional return is safe.
  const shouldShow = pathsWithCopyAsMarkdownButton.some((prefix) =>
    (pathname ?? "").startsWith(prefix)
  );
  if (!shouldShow) return null;

  let buttonText = "Copy page";
  let ButtonIcon = CopyIcon;
  if (copyState === "loading") {
    buttonText = "Copying...";
    ButtonIcon = Loader2;
  } else if (copyState === "copied") {
    buttonText = "Copied!";
    ButtonIcon = CheckIcon;
  } else if (copyState === "error") {
    buttonText = errorMessage;
  }

  return (
    <div className="inline-flex overflow-hidden items-center rounded-md bg-secondary">
      <button
        type="button"
        disabled={isDisabled || isError}
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-secondary-foreground",
          isDisabled || isError
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-secondary/80",
          isError
            ? "text-destructive-foreground bg-destructive hover:bg-destructive/80"
            : ""
        )}
      >
        <ButtonIcon
          className={cn("h-3 w-3", copyState === "loading" && "animate-spin")}
        />
        <span>{buttonText}</span>
      </button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isDisabled || isError}
            className={cn(
              "inline-flex items-center px-1 py-1 text-xs font-medium text-secondary-foreground border-l border-secondary-foreground/20",
              isDisabled || isError
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-secondary/80",
              isError
                ? "text-destructive-foreground bg-destructive hover:bg-destructive/80 border-destructive-foreground/20"
                : ""
            )}
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            onClick={handleCopy}
            disabled={isDisabled}
            className="flex gap-3 items-center py-1.5 px-3 cursor-pointer"
          >
            <CopyIcon className="w-4 h-4 shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium">Copy page</span>
              <span className="text-xs text-muted-foreground">
                Copy page as Markdown for LLMs
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={getChatGPTUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleChatGPTClick}
              className="flex gap-3 items-center py-1.5 px-3 cursor-pointer no-underline"
            >
              <IconChatGPT className="w-4 h-4 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="flex gap-1 items-center font-medium">
                  Open in ChatGPT
                  <ExternalLink
                    className="h-[1em] w-[1em] shrink-0"
                    strokeWidth={1.7}
                  />
                </span>
                <span className="text-xs text-muted-foreground">
                  Ask questions about this page
                </span>
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={getClaudeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClaudeClick}
              className="flex gap-3 items-center py-1.5 px-3 cursor-pointer no-underline"
            >
              <IconClaude className="w-4 h-4 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="flex gap-1 items-center font-medium">
                  Open in Claude
                  <ExternalLink
                    className="h-[1em] w-[1em] shrink-0"
                    strokeWidth={1.7}
                  />
                </span>
                <span className="text-xs text-muted-foreground">
                  Ask questions about this page
                </span>
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/docs/docs-mcp"
              onClick={() => {
                capture("copy_page", { type: "mcp" });
              }}
              target="_blank"
              className="flex gap-3 items-center py-1.5 px-3 cursor-pointer no-underline"
            >
              <IconMCP className="w-4 h-4 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="flex gap-1 items-center font-medium">
                  Install Docs MCP server
                  <ExternalLink
                    className="h-[1em] w-[1em] shrink-0"
                    strokeWidth={1.7}
                  />
                </span>
                <span className="text-xs text-muted-foreground">
                  Add to Cursor, Claude Code, VS Code, etc
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const MainContentWrapper = (props) => {
  const pathname = usePathname();
  const { frontMatter } = useConfig();
  const cookbook = COOKBOOK_ROUTE_MAPPING.find(
    (cookbook) => cookbook.path === pathname
  );

  const versionLabel = frontMatter.label;

  const shouldShowCopyButton = pathsWithCopyAsMarkdownButton.some((prefix) =>
    (pathname ?? "").startsWith(prefix)
  );

  return (
    <>
      {(versionLabel || shouldShowCopyButton) && (
        <div className="flex flex-wrap gap-2 items-center mt-5">
          {versionLabel != null && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
              {versionLabel as ReactNode}
            </span>
          )}
          {shouldShowCopyButton && <CopyMarkdownButton key={pathname} />}
        </div>
      )}

      {cookbook ? (
        <NotebookBanner src={cookbook.ipynbPath} className="mt-4 mb-4" />
      ) : null}


      {props.children}
      {isCustomerStory(pathname ?? "") && <CustomerStoryCTA />}
      <hr className="mx-4 my-4 border-t dark:border-neutral-800 md:mx-6 xl:mx-8" />
      {!pathsWithoutFooterWidgets.some(
        (path) =>
          pathname === path || (pathname ?? "").startsWith(path + "/")
      ) ? (
        <div
          className="flex flex-wrap gap-6 justify-between items-center px-4 py-6 pt-8 md:px-6 md:pt-8 xl:px-8 xl:pt-14"
          id="docs-feedback"
        >
          <DocsFeedback key={pathname} />
          <DocsSupport />
        </div>
      ) : null}
    </>
  );
};

export const DocsSupport = () => {
  return (
    <div className="flex gap-3 items-center">
      <Button variant="outline" size="sm" asChild>
        <a href="/support">
          <span>Support</span>
          <LifeBuoy className="ml-2 w-4 h-4" />
        </a>
      </Button>
    </div>
  );
};

export const DocsFeedback = () => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<
    "positive" | "negative" | "submitted" | null
  >(null);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);

  // Controls the prominent follow-up dialog shown after any rating
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleFeedbackSelection = (newSelection: "positive" | "negative") => {
    // For both positive and negative feedback, open dialog immediately
    setSelected(newSelection);
    setDialogOpen(true);
    setFeedbackComment("");
    setSubmitting(true);

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: pathname ?? "",
        feedback: newSelection,
      }),
    })
      .then(() => {
        setSubmitting(false);
      })
      .catch(() => {
        setSelected(null);
        setDialogOpen(false);
        setSubmitting(false);
      });
  };

  const handleFeedbackCommentSubmit = () => {
    setCommentSubmitting(true);

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: pathname ?? "",
        feedback: selected,
        comment: feedbackComment,
      }),
    })
      .then(() => {
        setSelected("submitted");
        setFeedbackComment("");
        setCommentSubmitting(false);
      })
      .catch(() => {
        setSelected(null);
        setDialogOpen(false);
        setCommentSubmitting(false);
      });
  };

  return (
    <div className="flex gap-3 items-center">
      <span className="text-sm font-medium">Was this page helpful?</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedbackSelection("positive")}
          disabled={submitting}
        >
          <ThumbsUp className="w-4 h-4 text-green-600" />
          <span className="sr-only">Yes</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedbackSelection("negative")}
          disabled={submitting}
        >
          <ThumbsDown className="w-4 h-4 text-red-600" />
          <span className="sr-only">No</span>
        </Button>
      </div>

      {/* Dialog for feedback follow-up */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelected(null);
            setFeedbackComment("");
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {selected === "submitted" ? (
            // Thank you view
            <div className="flex flex-col gap-4 items-center py-4 text-center">
              <ThumbsUp className="w-12 h-12 text-green-500" />
              <h4 className="text-lg font-semibold">
                Thank you for your feedback!
              </h4>
              <p className="text-sm text-muted-foreground">
                We appreciate you taking the time to help us improve.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="mt-4"
                onClick={() => {
                  setDialogOpen(false);
                  setSelected(null);
                }}
              >
                Done
              </Button>
            </div>
          ) : selected === "positive" ? (
            // Positive feedback follow-up
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <ThumbsUp className="mt-1 w-8 h-8 text-green-500" />
                <div>
                  <h4 className="mb-2 text-lg font-semibold">
                    What was most helpful?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Let us know what you found most useful (optional).
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="What was most helpful about this page?"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={commentSubmitting}
                  onClick={handleFeedbackCommentSubmit}
                >
                  {commentSubmitting ? "Submitting…" : "Send feedback"}
                </Button>
              </div>
            </div>
          ) : (
            // Negative feedback follow-up
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <Image
                  src="/images/people/marcklingen.jpg"
                  alt="Marc Klingen"
                  width={48}
                  height={48}
                  className="rounded-full aspect-square shrink-0"
                />
                <p className="text-sm leading-relaxed">
                  Documentation is super important to us and we genuinely want
                  to make it better. Could you share what was unclear or missing
                  on this page? Thank you for any hints! <br />
                  <span className="inline-block mt-2">
                    –{" "}
                    <Link
                      href="https://www.linkedin.com/in/marcklingen"
                      className="font-medium underline-offset-4 hover:underline"
                      target="_blank"
                    >
                      Marc Klingen
                    </Link>
                    , Co-founder &amp; Docs Lead
                  </span>
                </p>
              </div>

              <Textarea
                placeholder="Let us know how we can improve. Include your email if you'd like a reply."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />

              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={
                    commentSubmitting || feedbackComment.trim().length === 0
                  }
                  onClick={handleFeedbackCommentSubmit}
                >
                  {commentSubmitting ? "Submitting…" : "Send feedback"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
