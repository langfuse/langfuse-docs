export type TrustedByCustomer = {
  name: string;
  logo: string;
  caseStudyUrl?: string;
};

export type TrustedByData = {
  cloud: {
    [planName: string]: TrustedByCustomer[];
  };
};

export const trustedByData: TrustedByData = {
  cloud: {
    Hobby: [
      {
        name: "Hugging Face",
        logo: "/images/customers/pricing-logos/huggingface.png",
        caseStudyUrl: "/users/hugging-face",
      },
    ],
    Core: [
      {
        name: "Magic Patterns",
        logo: "/images/customers/pricing-logos/magicpatterns.png",
        caseStudyUrl: "/users/magic-patterns-ai-design-tools",
      },
      {
        name: "Draftbit",
        logo: "/images/customers/pricing-logos/draftbit.png",
      },
    ],
    Pro: [
      {
        name: "Canva",
        logo: "/images/customers/pricing-logos/canva.png",
        caseStudyUrl: "/users/canva",
      },
      { name: "Twilio", logo: "/images/customers/pricing-logos/twilio.png" },
      {
        name: "SumUp",
        logo: "/images/customers/pricing-logos/sumup.png",
        caseStudyUrl: "/users/sumup",
      },
      { name: "Brevo", logo: "/images/customers/pricing-logos/brevo.png" },
    ],
    Enterprise: [
      {
        name: "Ramp",
        logo: "/images/customers/pricing-logos/ramp.png",
        caseStudyUrl: "/users/ramp",
      },
      { name: "GoDaddy", logo: "/images/customers/pricing-logos/godaddy.png" },
      {
        name: "Khan Academy",
        logo: "/images/customers/pricing-logos/khanacademy.png",
        caseStudyUrl: "/users/khan-academy",
      },
      {
        name: "Merck Group",
        logo: "/images/customers/pricing-logos/merckgroup.png",
        caseStudyUrl: "/users/merckgroup",
      },
    ],
  },
};
