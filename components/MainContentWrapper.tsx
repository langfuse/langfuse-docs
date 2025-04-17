import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useConfig } from "nextra-theme-docs";
import config from "../theme.config";
import { Button } from "./ui/button";
import {
  Calendar,
  Copy as CopyIcon,
  Check as CheckIcon,
  Mail,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { showChat } from "./supportChat";
import { Background } from "./Background";
import { NotebookBanner } from "./NotebookBanner";
import { ProductUpdateSignup } from "./productUpdateSignup";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";
import IconGithub from "./icons/github";
import { cn } from "@/lib/utils";

const pathsWithoutFooterWidgets = ["/imprint", "/blog"];

const CopyMarkdownButton = () => {
  const router = useRouter();
  const { docsRepositoryBase } = config;
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

  const handleCopy = async () => {
    // Clear any existing timeout before starting a new operation
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    setCopyState("loading");
    setErrorMessage("");

    if (!docsRepositoryBase) {
      console.error("docsRepositoryBase is not defined in theme config.");
      setErrorMessage("Config Error");
      setCopyState("error");
      timeoutIdRef.current = setTimeout(() => {
        setCopyState("idle");
        timeoutIdRef.current = null;
      }, 3000);
      return;
    }

    let basePath = router.pathname;
    if (basePath.startsWith("/")) basePath = basePath.substring(1);
    if (basePath.endsWith("/")) basePath = basePath.slice(0, -1);
    if (!basePath) basePath = "index"; // Handle root index page

    const potentialPaths = [
      `pages/${basePath}.mdx`,
      `pages/${basePath}.md`,
      `pages/${basePath}/index.mdx`,
      `pages/${basePath}/index.md`,
    ];

    const fetchPromises = potentialPaths.map(async (filePath) => {
      const rawUrl = `${docsRepositoryBase
        ?.replace("https://github.com/", "https://raw.githubusercontent.com/")
        .replace("/tree/", "/")}/${filePath}`;
      const response = await fetch(rawUrl);
      if (!response.ok) {
        throw new Error(
          `Fetch failed for ${filePath}: ${response.status} ${response.statusText}`
        );
      }
      return response.text(); // Return the markdown text on success
    });

    try {
      // Use Promise.any to get the first successful fetch
      const markdown = await Promise.any(fetchPromises);

      await navigator.clipboard.writeText(markdown);
      setCopyState("copied");
      timeoutIdRef.current = setTimeout(() => {
        setCopyState("idle");
        timeoutIdRef.current = null;
      }, 2000);
    } catch (error: any) {
      // Check if it's an AggregateError from Promise.any (all fetches failed)
      let all404 = false;
      if (error instanceof AggregateError) {
        // Check if *all* failures were 404s
        all404 = error.errors.every((e) => e.message?.includes("404"));
        if (!all404) {
          // Log only if there was a non-404 error
          console.error(
            "Failed to copy markdown due to unexpected fetch error:",
            error
          );
          setErrorMessage("Fetch Error");
        } else {
          // All were 404s, this is expected
          console.log(
            "Source markdown file not found at any potential path for:",
            router.pathname
          );
          setErrorMessage("Source Files Not Found");
        }
      } else {
        // Log other types of errors (clipboard, generic, etc.)
        console.error("Failed to copy markdown:", error);
        if (
          error.name === "NotAllowedError" ||
          error.name === "SecurityError"
        ) {
          setErrorMessage("Clipboard Permission Denied");
        } else {
          setErrorMessage("Copy Error"); // Generic error for other issues
        }
      }

      setCopyState("error");
      timeoutIdRef.current = setTimeout(() => {
        setCopyState("idle");
        timeoutIdRef.current = null;
      }, 3000);
    }
  };

  let buttonText = "Copy as Markdown";
  let ButtonIcon = CopyIcon;
  if (copyState === "loading") {
    buttonText = "Copying...";
  } else if (copyState === "copied") {
    buttonText = "Copied!";
    ButtonIcon = CheckIcon;
  } else if (copyState === "error") {
    buttonText = errorMessage;
  }

  const isDisabled = copyState === "loading" || copyState === "copied";

  return (
    <button
      type="button"
      disabled={isDisabled || copyState === "error"}
      onClick={!isDisabled ? handleCopy : undefined}
      className={cn(
        "inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
        isDisabled || copyState === "error"
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-secondary/80",
        copyState === "error"
          ? "text-destructive-foreground bg-destructive hover:bg-destructive/80"
          : ""
      )}
    >
      {buttonText}
      <ButtonIcon className="h-3 w-3 ml-1.5" />
    </button>
  );
};

export const MainContentWrapper = (props) => {
  const router = useRouter();
  const { frontMatter } = useConfig();
  const cookbook = COOKBOOK_ROUTE_MAPPING.find(
    (cookbook) => cookbook.path === router.pathname
  );

  const versionLabel = frontMatter.label;

  const allowedPrefixes = ["/docs", "/self-hosting", "/guide", "/faq"];
  const shouldShowCopyButton = allowedPrefixes.some((prefix) =>
    router.pathname.startsWith(prefix)
  );

  return (
    <>
      {(versionLabel || shouldShowCopyButton) && (
        <div className="flex items-center gap-2 flex-wrap mt-5">
          {versionLabel && (
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {versionLabel}
            </span>
          )}
          {shouldShowCopyButton && <CopyMarkdownButton />}
        </div>
      )}

      {cookbook ? (
        <NotebookBanner src={cookbook.ipynbPath} className="mb-4 mt-4" />
      ) : null}

      {props.children}
      {!pathsWithoutFooterWidgets.includes(router.pathname) ? (
        <div
          className="flex flex-col gap-10 pt-14 border-t dark:border-neutral-800 mb-20"
          id="docs-feedback"
        >
          <DocsFeedback key={router.pathname} />
          <DocsSupport />
          <DocsSubscribeToUpdates />
        </div>
      ) : null}
      <Background />
    </>
  );
};

export const DocsSubscribeToUpdates = () => {
  return (
    <div className="flex flex-col items-start gap-3">
      <h3 className="text-xl font-semibold">Subscribe to updates</h3>
      <div className="flex gap-3 flex-wrap">
        <ProductUpdateSignup source="docs-footer" small />
      </div>
    </div>
  );
};

export const DocsSupport = () => {
  return (
    <div className="flex flex-col items-start gap-3">
      <h3 className="text-xl font-semibold" id="contact">
        Questions? We're here to help
      </h3>
      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <a href="/gh-support" target="_blank">
            <span>GitHub Q&A</span>
            <IconGithub className="h-4 w-4 ml-3" />
          </a>
        </Button>
        <Button variant="outline" size="sm" onClick={() => showChat()}>
          <span>Chat</span> <MessageSquare className="h-4 w-4 ml-3" />
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="mailto:support@langfuse.com" target="_blank">
            <span>Email</span>
            <Mail className="h-4 w-4 ml-3" />
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/schedule-demo" target="_blank">
            <span>Talk to sales</span>
            <Calendar className="h-4 w-4 ml-3" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export const DocsFeedback = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<
    "positive" | "negative" | "submitted" | null
  >(null);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFeedbackSelection = (newSelection: "positive" | "negative") => {
    setSubmitting(true);
    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: router.pathname,
        feedback: newSelection,
      }),
    })
      .then(() => {
        setFeedbackComment("");
        setSelected(newSelection);
        setSubmitting(false);
      })
      .catch(() => setSelected(null));
  };

  const handleFeedbackCommentSubmit = () => {
    setSubmitting(true);
    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: router.pathname,
        feedback: selected,
        comment: feedbackComment,
      }),
    })
      .then(() => {
        setSelected("submitted");
        setFeedbackComment("");
        setSubmitting(false);
      })
      .catch(() => setSelected(null));
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-semibold">
        {selected === null
          ? "Was this page useful?"
          : selected === "positive"
          ? "What was most useful?"
          : selected === "negative"
          ? "What can we improve?"
          : "Thanks for your feedback!"}
      </h3>
      {selected === null ? (
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="xl"
            onClick={() => handleFeedbackSelection("positive")}
            disabled={submitting}
          >
            <span>Yes</span>
            <ThumbsUp className="h-5 w-5 ml-4 text-green-800" />
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => handleFeedbackSelection("negative")}
            disabled={submitting}
          >
            <span>Could be better</span>
            <ThumbsDown className="h-5 w-5 ml-4 text-red-800" />
          </Button>
        </div>
      ) : selected === "positive" || selected === "negative" ? (
        <div className="flex flex-col gap-3">
          <Textarea
            placeholder={
              selected === "positive"
                ? "Let us know what you found most useful"
                : "Let us know what we can improve"
            }
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
          <Button
            variant="secondary"
            className="self-start"
            size="lg"
            disabled={submitting}
            onClick={handleFeedbackCommentSubmit}
          >
            {submitting ? "Submitting ..." : "Send feedback"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSelected(null)}
            className="self-start"
          >
            Send more feedback
          </Button>
        </div>
      )}
    </div>
  );
};
