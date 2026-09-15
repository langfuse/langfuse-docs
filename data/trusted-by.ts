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
        logo: "/images/customers/picing-logos/huggingface.png",
        caseStudyUrl: "/users/hugging-face",
      },
    ],
    Core: [
      {
        name: "Magic Patterns",
        logo: "/images/customers/picing-logos/magicpatterns.png",
        caseStudyUrl: "/users/magic-patterns-ai-design-tools",
      },
      { name: "Draftbit", logo: "/images/customers/picing-logos/draftbit.png" },
    ],
    Pro: [
      {
        name: "Canva",
        logo: "/images/customers/picing-logos/canva.png",
        caseStudyUrl: "/users/canva",
      },
      { name: "Twilio", logo: "/images/customers/picing-logos/twilio.png" },
      {
        name: "SumUp",
        logo: "/images/customers/picing-logos/sumup.png",
        caseStudyUrl: "/users/sumup",
      },
      { name: "Brevo", logo: "/images/customers/picing-logos/brevo.png" },
    ],
    Enterprise: [
      { name: "GoDaddy", logo: "/images/customers/picing-logos/godaddy.png" },
      {
        name: "Khan Academy",
        logo: "/images/customers/picing-logos/khanacademy.png",
        caseStudyUrl: "/users/khan-academy",
      },
      {
        name: "Merck Group",
        logo: "/images/customers/picing-logos/merckgroup.png",
        caseStudyUrl: "/users/merckgroup",
      },
    ],
  },
};
