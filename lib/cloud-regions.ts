export const cloudRegions = {
  eu: {
    url: "https://cloud.langfuse.com",
    label: "EU region",
  },
  us: {
    url: "https://us.cloud.langfuse.com",
    label: "US region",
  },
  hipaa: {
    url: "https://hipaa.cloud.langfuse.com",
    label: "HIPAA region",
  },
} as const;

export type CloudRegionKey = keyof typeof cloudRegions;

export const cloudRegionSelectorOrder: CloudRegionKey[] = [
  "us",
  "hipaa",
  "eu",
];

export const continentHostMapping: Record<string, string> = {
  AF: cloudRegions.eu.url, // Africa
  AN: cloudRegions.eu.url, // Antarctica
  AS: cloudRegions.eu.url, // Asia
  EU: cloudRegions.eu.url, // Europe
  NA: cloudRegions.us.url, // North America
  OC: cloudRegions.eu.url, // Oceania
  SA: cloudRegions.us.url, // South America
};

export const createInitialCloudRegionSignInState = () =>
  Object.fromEntries(
    Object.keys(cloudRegions).map((key) => [key, false])
  ) as Record<CloudRegionKey, boolean>;

export const isSignedInSession = (session: unknown) => {
  return !!session && typeof session === "object" && "user" in session;
};
