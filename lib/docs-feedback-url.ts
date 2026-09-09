import { buildPageUrl } from "./og-url";

const FEEDBACK_ISSUE_BASE =
  "https://github.com/langfuse/langfuse-docs/issues/new";

/** GitHub issue URL for the docs sidebar "Give us feedback" action. */
export function getDocsFeedbackIssueUrl(
  pagePath: string,
  pageTitle?: string,
): string {
  const title = (pageTitle ?? "this page").trim();
  const pageUrl = buildPageUrl(pagePath);
  const params = new URLSearchParams({
    title: `Feedback for "${title}"`,
    labels: "feedback",
    body: `**Page:** ${pageUrl}\n`,
  });
  return `${FEEDBACK_ISSUE_BASE}?${params.toString()}`;
}
