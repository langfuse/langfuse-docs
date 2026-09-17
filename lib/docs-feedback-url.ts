import { buildPageUrl } from "./og-url";

const FEEDBACK_ISSUE_BASE =
  "https://github.com/langfuse/langfuse-docs/issues/new";

/** GitHub issue URL for the docs sidebar "Give us feedback" action. */
export function getDocsFeedbackIssueUrl(pagePath: string): string {
  const pageUrl = buildPageUrl(pagePath);
  const params = new URLSearchParams({
    title: `Feedback for ${pageUrl}`,
    labels: "feedback",
  });
  return `${FEEDBACK_ISSUE_BASE}?${params.toString()}`;
}
