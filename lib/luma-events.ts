/**
 * Fetches Langfuse community events from Luma.
 *
 * Prefers the official Calendar API when `LUMA_API_KEY` is set (Plus plan).
 * Falls back to Luma's public calendar feed so the page works in local/preview
 * without secrets. Results are cached with ISR (hourly).
 */

const LUMA_CALENDAR_API_ID = "cal-KI9FVvGbV9LMK3g";
const LUMA_CALENDAR_URL = "https://lu.ma/langfuse";
const OFFICIAL_LIST_URL =
  "https://public-api.luma.com/v1/calendars/events/list";
const PUBLIC_LIST_URL = "https://api.lu.ma/calendar/get-items";

export type LumaEventFormat = "virtual" | "in-person";

export type LumaEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string | null;
  timezone: string | null;
  format: LumaEventFormat;
  locationLabel: string;
  url: string;
  coverUrl: string | null;
};

export type LumaEventsResult = {
  upcoming: LumaEvent[];
  past: LumaEvent[];
};

type GeoAddressInfo = {
  city?: string | null;
  city_state?: string | null;
  region?: string | null;
  country?: string | null;
  address?: string | null;
  full_address?: string | null;
  mode?: string | null;
};

type RawLumaEvent = {
  id?: string;
  api_id?: string;
  name?: string;
  start_at?: string;
  end_at?: string | null;
  timezone?: string | null;
  location_type?: string | null;
  url?: string | null;
  cover_url?: string | null;
  geo_address_info?: GeoAddressInfo | null;
  geo_address_json?: GeoAddressInfo | null;
  virtual_info?: unknown;
};

function isVirtualLocation(locationType: string | null | undefined): boolean {
  if (!locationType) return false;
  return locationType !== "offline";
}

function eventUrl(slugOrUrl: string | null | undefined, id: string): string {
  if (!slugOrUrl) return `${LUMA_CALENDAR_URL}?ek=${id}`;
  if (slugOrUrl.startsWith("http://") || slugOrUrl.startsWith("https://")) {
    return slugOrUrl;
  }
  return `https://lu.ma/${slugOrUrl}`;
}

function locationLabel(event: RawLumaEvent, format: LumaEventFormat): string {
  if (format === "virtual") return "Virtual";

  const geo = event.geo_address_info ?? event.geo_address_json;
  if (!geo) return "In person";

  if (geo.city && geo.country) {
    const city = geo.city === "The Rocks" ? "Sydney" : geo.city;
    const country =
      geo.country.length === 2
        ? (new Intl.DisplayNames(["en"], { type: "region" }).of(geo.country) ??
          geo.country)
        : geo.country;
    return `${city}, ${country}`;
  }

  return (
    geo.city_state ||
    geo.city ||
    geo.address ||
    geo.full_address ||
    geo.country ||
    "In person"
  );
}

function normalizeEvent(raw: RawLumaEvent): LumaEvent | null {
  const id = raw.api_id || raw.id;
  const title = raw.name?.trim();
  const startAt = raw.start_at;

  if (!id || !title || !startAt) return null;

  const format: LumaEventFormat = isVirtualLocation(raw.location_type)
    ? "virtual"
    : "in-person";

  return {
    id,
    title,
    startAt,
    endAt: raw.end_at ?? null,
    timezone: raw.timezone ?? null,
    format,
    locationLabel: locationLabel(raw, format),
    url: eventUrl(raw.url, id),
    coverUrl: raw.cover_url ?? null,
  };
}

function unwrapEntry(entry: unknown): RawLumaEvent | null {
  if (!entry || typeof entry !== "object") return null;
  const record = entry as Record<string, unknown>;
  if (record.event && typeof record.event === "object") {
    return record.event as RawLumaEvent;
  }
  return record as RawLumaEvent;
}

async function fetchOfficialEvents(apiKey: string): Promise<RawLumaEvent[]> {
  const events: RawLumaEvent[] = [];
  let cursor: string | null = null;

  do {
    const params = new URLSearchParams({
      pagination_limit: "50",
      sort_column: "start_at",
      sort_direction: "desc",
      access: "manage",
    });
    params.append("access", "view");
    if (cursor) params.set("pagination_cursor", cursor);

    const response = await fetch(`${OFFICIAL_LIST_URL}?${params}`, {
      headers: {
        Accept: "application/json",
        "x-luma-api-key": apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Official Luma API failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      entries?: unknown[];
      has_more?: boolean;
      next_cursor?: string | null;
    };

    for (const entry of data.entries ?? []) {
      const raw = unwrapEntry(entry);
      if (raw) events.push(raw);
    }

    cursor = data.has_more ? (data.next_cursor ?? null) : null;
  } while (cursor);

  return events;
}

async function fetchPublicPeriod(
  period: "future" | "past",
): Promise<RawLumaEvent[]> {
  const events: RawLumaEvent[] = [];
  let cursor: string | null = null;

  do {
    const params = new URLSearchParams({
      calendar_api_id: LUMA_CALENDAR_API_ID,
      period,
      pagination_limit: "50",
    });
    if (cursor) params.set("pagination_cursor", cursor);

    const response = await fetch(`${PUBLIC_LIST_URL}?${params}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "langfuse-docs/events",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Public Luma calendar feed failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      entries?: unknown[];
      has_more?: boolean;
      next_cursor?: string | null;
    };

    for (const entry of data.entries ?? []) {
      const raw = unwrapEntry(entry);
      if (raw) events.push(raw);
    }

    cursor = data.has_more ? (data.next_cursor ?? null) : null;
  } while (cursor);

  return events;
}

function splitUpcomingPast(events: LumaEvent[]): LumaEventsResult {
  const now = Date.now();
  const upcoming: LumaEvent[] = [];
  const past: LumaEvent[] = [];

  for (const event of events) {
    const endMs = Date.parse(event.endAt || event.startAt);
    if (Number.isFinite(endMs) && endMs >= now) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  upcoming.sort(
    (a, b) =>
      Date.parse(a.startAt) - Date.parse(b.startAt) ||
      a.title.localeCompare(b.title),
  );
  past.sort(
    (a, b) =>
      Date.parse(b.startAt) - Date.parse(a.startAt) ||
      a.title.localeCompare(b.title),
  );

  return { upcoming, past };
}

/**
 * Returns upcoming and past Luma events, or `null` if the calendar could not be
 * fetched. Callers should show a graceful fallback CTA when `null`.
 */
export async function getLumaEvents(): Promise<LumaEventsResult | null> {
  try {
    const apiKey = process.env.LUMA_API_KEY?.trim();
    const rawEvents = apiKey
      ? await fetchOfficialEvents(apiKey)
      : [
          ...(await fetchPublicPeriod("future")),
          ...(await fetchPublicPeriod("past")),
        ];

    const normalized = rawEvents
      .map(normalizeEvent)
      .filter((event): event is LumaEvent => event !== null);

    // Deduplicate by id (official + view access or pagination overlap).
    const byId = new Map<string, LumaEvent>();
    for (const event of normalized) {
      byId.set(event.id, event);
    }

    return splitUpcomingPast(Array.from(byId.values()));
  } catch (error) {
    console.error("Failed to fetch Luma events", error);
    return null;
  }
}

export { LUMA_CALENDAR_URL };
