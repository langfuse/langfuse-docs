export const cloudRegions = {
  eu: {
    url: "https://cloud.langfuse.com",
    label: "EU region",
  },
  us: {
    url: "https://us.cloud.langfuse.com",
    label: "US region",
  },
  jp: {
    url: "https://jp.cloud.langfuse.com",
    label: "Japan region",
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
  "jp",
];

export const createInitialCloudRegionSignInState = () =>
  Object.fromEntries(
    Object.keys(cloudRegions).map((key) => [key, false])
  ) as Record<CloudRegionKey, boolean>;

export const isSignedInSession = (session: unknown) => {
  return !!session && typeof session === "object" && "user" in session;
};
