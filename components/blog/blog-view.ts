export const BLOG_VIEWS = ["lead", "mosaic", "split"] as const;

export type BlogView = (typeof BLOG_VIEWS)[number];

export const DEFAULT_BLOG_VIEW: BlogView = "lead";

export const BLOG_VIEW_LABELS: Record<BlogView, string> = {
  lead: "Lead",
  mosaic: "Mosaic",
  split: "Index",
};

export function parseBlogView(value: string | null): BlogView {
  if (value === "mosaic" || value === "split" || value === "lead") return value;
  return DEFAULT_BLOG_VIEW;
}
