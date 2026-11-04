export type EnterpriseLogoCompany = {
  name: string;
  customerStoryPath?: string;
  hidden?: boolean;
};

export const enterpriseLogoCompanies: EnterpriseLogoCompany[] = [
  { name: "Ramp", customerStoryPath: "/users/ramp" },
  {
    name: "Trade Republic",
    customerStoryPath: "/users/trade-republic",
    hidden: true,
  },
  { name: "Canva", customerStoryPath: "/users/canva" },
  { name: "Expedia Group" },
  { name: "Pigment" },
  { name: "Khan Academy", customerStoryPath: "/users/khan-academy" },
  { name: "Hugging Face", customerStoryPath: "/users/hugging-face" },
  { name: "Intuit" },
  { name: "SumUp", customerStoryPath: "/users/sumup" },
  { name: "Circleback", hidden: true },
  { name: "Merck", customerStoryPath: "/users/merckgroup" },
  { name: "Samsara" },
  { name: "freee", hidden: true },
  {
    name: "Magic Patterns",
    customerStoryPath: "/users/magic-patterns-ai-design-tools",
    hidden: true,
  },
  { name: "Cisco" },
  { name: "Rocket Money" },
];
