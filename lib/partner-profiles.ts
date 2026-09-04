export type PartnerProfile = {
  name: string;
  url: string;
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  regions: readonly string[];
  capabilities: readonly string[];
  summary: string;
};

export const langfusePartnerProfiles: readonly PartnerProfile[] = [
  {
    name: "GAO",
    url: "https://www.gao-ai.com/",
    regions: ["Japan", "APAC"],
    capabilities: [
      "AI agent implementation",
      "Langfuse professional services",
      "Technical support",
      "Local procurement in Japan",
    ],
    summary:
      "GAO helps organizations across Japan and APAC adopt Langfuse as part of production AI initiatives, with implementation services, technical support, and local procurement support in Japan.",
  },
];
