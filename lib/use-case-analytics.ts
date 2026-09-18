import { cloudRegions } from "./cloud-regions";

export type UseCase = "chat_agents" | "coding_agents" | "workflow_automation";
export type SetupPath = "gateway" | "hooks";
export type DestinationGroup =
  | "signup"
  | "sales"
  | "docs"
  | "stories"
  | "integrations"
  | "resources"
  | "image"
  | "other";

export interface UseCasePageProperties {
  use_case: UseCase;
  page_path: string;
  page_view_id: string;
  page_version: "v1";
  setup_path?: SetupPath;
}

export interface UseCaseActionProperties extends UseCasePageProperties {
  section: string;
  action: string;
  item: string;
  placement_id: string;
  destination: string;
  destination_group: DestinationGroup;
}

export interface UseCaseAttribution {
  use_case: UseCase;
  section: string;
  action: string;
  setup_path?: SetupPath;
}

const cloudHosts = new Set(
  Object.values(cloudRegions).map(({ url }) => new URL(url).hostname),
);
const STORAGE_KEY = "lf_use_case_attribution";
export const ATTRIBUTION_TTL_MS = 30 * 60 * 1000;

export function isUseCase(value: unknown): value is UseCase {
  return ["chat_agents", "coding_agents", "workflow_automation"].includes(
    value as UseCase,
  );
}

export function destinationGroup(url: URL, origin: string): DestinationGroup {
  if (!["https:", "http:"].includes(url.protocol)) return "other";
  if (cloudHosts.has(url.hostname)) return "signup";
  if (url.origin !== origin) return "other";
  const path = url.pathname;
  if (/^\/cloud(?:\/|$)/.test(path)) return "signup";
  if (/^\/(talk-to-us|demo)\/?$/.test(path)) return "sales";
  if (/^\/integrations(?:\/|$)/.test(path)) return "integrations";
  if (/^\/users(?:\/|$)/.test(path)) return "stories";
  if (/^\/(docs|self-hosting)(?:\/|$)/.test(path)) return "docs";
  if (/^\/(resources|guides|academy|blog|compare)(?:\/|$)/.test(path))
    return "resources";
  if (/^\/images\//.test(path)) return "image";
  return "other";
}

export function actionForDestination(group: DestinationGroup): string {
  return {
    signup: "start_free",
    sales: "talk_to_sales",
    docs: "documentation",
    stories: "read_story",
    integrations: "view_integration",
    resources: "read_guide",
    image: "open_image",
    other: "navigate",
  }[group];
}

export function attributionFromParams(
  params: URLSearchParams,
): UseCaseAttribution | null {
  const use_case = params.get("lf_use_case");
  const section = params.get("lf_section");
  const action = params.get("lf_action");
  const path = params.get("lf_setup_path");
  const validToken = (value: string | null): value is string =>
    Boolean(value && /^[a-z0-9_-]{1,80}$/.test(value));
  if (!isUseCase(use_case) || !validToken(section) || !validToken(action)) {
    return null;
  }
  return {
    use_case,
    section,
    action,
    ...(path === "gateway" || path === "hooks" ? { setup_path: path } : {}),
  };
}

/** Keep acquisition UTMs intact; these parameters describe an onsite action. */
export function withUseCaseAttribution(
  href: string,
  origin: string,
  attribution: UseCaseAttribution,
): string {
  const url = new URL(href, origin);
  const group = destinationGroup(url, origin);
  if (group !== "signup" && group !== "sales") return href;
  url.searchParams.set("lf_use_case", attribution.use_case);
  url.searchParams.set("lf_section", attribution.section);
  url.searchParams.set("lf_action", attribution.action);
  if (attribution.setup_path) {
    url.searchParams.set("lf_setup_path", attribution.setup_path);
  } else {
    url.searchParams.delete("lf_setup_path");
  }
  return url.origin === origin
    ? `${url.pathname}${url.search}${url.hash}`
    : url.href;
}

export function rememberUseCaseAttribution(value: UseCaseAttribution) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...value, expires_at: Date.now() + ATTRIBUTION_TTL_MS }),
    );
  } catch {
    // Blocked storage must never interrupt navigation or form submission.
  }
}

export function readUseCaseAttribution(): UseCaseAttribution | null {
  if (typeof window === "undefined") return null;
  const fromUrl = attributionFromParams(
    new URLSearchParams(window.location.search),
  );
  if (fromUrl) return fromUrl;
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (!stored || !(stored.expires_at > Date.now())) return null;
    return attributionFromParams(
      new URLSearchParams({
        lf_use_case: stored.use_case,
        lf_section: stored.section,
        lf_action: stored.action,
        lf_setup_path: stored.setup_path ?? "",
      }),
    );
  } catch {
    return null;
  }
}

export function dispatchUseCaseInteraction(
  element: HTMLElement,
  kind: "benefit_opened" | "path_selected",
  item: string,
) {
  element.dispatchEvent(
    new CustomEvent("lf:use-case-interaction", {
      bubbles: true,
      detail: { kind, item },
    }),
  );
}
