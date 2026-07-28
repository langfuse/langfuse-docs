const PUBLIC_DEMO_PROJECT_URL =
  "https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi";

export const createPublicDemoProjectTraceUrl = (traceId?: string | null) => {
  if (!traceId) {
    return undefined;
  }

  return `${PUBLIC_DEMO_PROJECT_URL}/traces/${encodeURIComponent(traceId)}`;
};
