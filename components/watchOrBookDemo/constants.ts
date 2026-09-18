export const WALKTHROUGH_VIDEO = {
  videoId: "THfB4p2xCFY",
  title: "Introduction to Langfuse",
  description:
    "Get an overview of the complete Langfuse platform and learn how it helps teams build better LLM applications through observability, prompt management, and evaluation.",
  docs: {
    title: "Technical documentation",
    href: "/docs",
  },
};

/**
 * Shared with the Markdown renderer in lib/markdown-component-renderers.js so
 * the plain-Markdown build of /watch-demo keeps these links. Keep hrefs
 * redirect-free (e.g. /docs/demo, not /demo).
 */
export const SELF_SERVE_LINKS = [
  { href: "/docs", label: "Documentation" },
  { href: "/self-hosting", label: "Self-hosting docs" },
  { href: "/docs/demo", label: "Interactive Example Project" },
  { href: "/pricing", label: "Pricing" },
  { href: "/enterprise", label: "Enterprise FAQ" },
  { href: "/security", label: "Security Center" },
  { href: "/ask-ai", label: "Questions? Ask AI" },
  { href: "/support", label: "Contact Support" },
  {
    href: "/cloud",
    label: "Create a free account (no credit card required)",
  },
];

/** Shared with the Markdown renderer, same as SELF_SERVE_LINKS. */
export const TALK_TO_US_BENEFITS = [
  "Get a Demo",
  "Get Volume Pricing",
  "Pay by Invoice",
  "Ask questions about our Security & Compliance Policies",
];
