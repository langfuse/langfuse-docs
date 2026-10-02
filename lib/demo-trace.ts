/** Region-aware path into the shared Langfuse Cloud demo project. */
export const DEMO_PROJECT_PATH = "/cloud/demo";

/** Traces list in the shared demo project. */
export const DEMO_TRACES_PATH = `${DEMO_PROJECT_PATH}/traces`;

export type DemoTraceSource =
  | "qa_chatbot"
  | "image_generator"
  | "voice_agent"
  | "rock_paper_scissors"
  | "sentiment_classifier";

/** Where the click originated for Cloud analytics. */
export type DemoTraceUtmCampaign = "demo_project" | "blog";

/** Whether the link opens the project generally or a specific trace. */
export type DemoTraceUtmContent = "project" | "trace";

const DEMO_UTM_SOURCE = "docs";

const withDemoUtm = (
  path: string,
  {
    campaign,
    content,
  }: {
    campaign: DemoTraceUtmCampaign;
    content: DemoTraceUtmContent;
  },
) => {
  const url = new URL(path, "https://langfuse.com");
  url.searchParams.set("utm_source", DEMO_UTM_SOURCE);
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_content", content);
  return `${url.pathname}${url.search}${url.hash}`;
};

/** Link to the shared demo project root (`/cloud/demo`). */
export const buildDemoProjectUrl = ({
  campaign = "demo_project",
}: {
  campaign?: DemoTraceUtmCampaign;
} = {}) =>
  withDemoUtm(DEMO_PROJECT_PATH, {
    campaign,
    content: "project",
  });

/** Link to the demo project traces list (`/cloud/demo/traces`). */
export const buildDemoTracesListUrl = ({
  campaign = "demo_project",
}: {
  campaign?: DemoTraceUtmCampaign;
} = {}) =>
  withDemoUtm(DEMO_TRACES_PATH, {
    campaign,
    content: "project",
  });

/**
 * Build a link to a specific demo-project trace.
 * Goes through `/cloud` so the reader can pick a region, then lands on
 * `/demo/traces/{traceId}` in Langfuse Cloud.
 */
export const buildDemoTraceUrl = ({
  traceId,
  observationId,
  campaign = "demo_project",
}: {
  traceId?: string | null;
  observationId?: string | null;
  campaign?: DemoTraceUtmCampaign;
} = {}) => {
  if (!traceId) {
    return buildDemoTracesListUrl({ campaign });
  }

  const path = `${DEMO_TRACES_PATH}/${traceId}`;
  const params = new URLSearchParams({
    utm_source: DEMO_UTM_SOURCE,
    utm_campaign: campaign,
    utm_content: "trace",
  });
  if (observationId) {
    params.set("observation", observationId);
  }
  return `${path}?${params.toString()}`;
};
