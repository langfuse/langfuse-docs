import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "nextra-theme-docs";
import config from "../theme.config";
import {
  Copy as CopyIcon,
  Check as CheckIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const CopyMarkdownButton = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { docsRepositoryBase } = config;
  const [copyState, setCopyState] = useState<
    "idle" | "loading" | "copied" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("Error Copying");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
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

  const handleChatGPT = () => {
    const currentUrl = `https://langfuse.com${router.pathname}`;
    const query = `I'm building with Langfuse - can you read this docs page ${currentUrl} so I can ask you questions about it?`;
    const chatGPTUrl = `https://chatgpt.com/?q=${encodeURIComponent(query)}`;
    window.open(chatGPTUrl, '_blank');
  };

  const handleClaude = () => {
    const currentUrl = `https://langfuse.com${router.pathname}`;
    const query = `I'm building with Langfuse - can you read this docs page ${currentUrl} so I can ask you questions about it?`;
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(query)}`;
    window.open(claudeUrl, '_blank');
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Open dropdown immediately
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Close dropdown with a delay
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
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
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          className={cn(
            "inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80",
            copyState === "error"
              ? "text-destructive-foreground bg-destructive hover:bg-destructive/80"
              : ""
          )}
        >
          {buttonText}
          <ButtonIcon className="h-3 w-3 ml-1.5" />
          <ChevronDown className="h-3 w-3 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card border-border"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenuItem 
          onClick={!isDisabled ? handleCopy : undefined}
          disabled={isDisabled || copyState === "error"}
          className={cn(
            "cursor-pointer",
            isDisabled || copyState === "error" ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <CopyIcon className="h-4 w-4 mr-2" />
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleChatGPT} className="cursor-pointer">
          <Image 
            src={resolvedTheme === 'dark' ? "/images/logos/OpenAI light.png" : "/images/logos/OpenAI.png"}
            alt="OpenAI" 
            width={16} 
            height={16} 
            className="mr-2" 
          />
          Ask ChatGPT about this
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClaude} className="cursor-pointer">
          <Image 
            src="/images/logos/claude.png" 
            alt="Claude" 
            width={16} 
            height={16} 
            className="mr-2" 
          />
          Ask Claude about this
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 