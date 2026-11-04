export const ACADEMY_LOOP_URL =
  "https://langfuse.com/academy/ai-engineering-loop";

/** True only for the Academy loop page, with or without a .md suffix. */
export function isAcademyLoopUrl(value) {
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\.md$/, "").replace(/\/$/, "");
    return (
      url.protocol === "https:" &&
      url.hostname === "langfuse.com" &&
      !url.username &&
      !url.password &&
      path === "/academy/ai-engineering-loop"
    );
  } catch {
    return false;
  }
}
