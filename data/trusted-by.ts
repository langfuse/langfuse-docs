/**
 * Customer data for the "Trusted by" section in pricing cards.
 * 
 * This displays customer logos in overlapping circular containers for each pricing tier.
 * When customers are available, shows logos with hover tooltips.
 * When no customers are assigned to a tier, falls back to "40,000+ builders" text.
 * 
 * Used by: components/home/components/TrustedBy.tsx
 * Displayed in: components/home/Pricing.tsx (cloud pricing cards only)
 */

export type TrustedByCustomer = {
  name: string;
  logo: string;
};

export type TrustedByData = {
  cloud: {
    [planName: string]: TrustedByCustomer[];
  };
};

export const trustedByData: TrustedByData = {
  cloud: {
    "Hobby": [
      // No logos assigned to Hobby plan yet
    ],
    "Core": [
      //{ name: "Knowunity", logo: "/images/customers/picing-logos/knowunity.png" },
      { name: "Kombo", logo: "/images/customers/picing-logos/kombo.png" },
      { name: "Draftbit", logo: "/images/customers/picing-logos/draftbit.png" },
      //{ name: "GoDaddy", logo: "/images/customers/picing-logos/godaddy.png" },
    ],
    "Pro": [
      { name: "Twilio", logo: "/images/customers/picing-logos/twilio.png" },
      { name: "SumUp", logo: "/images/customers/picing-logos/sumup.png" },
      //{ name: "Brevo", logo: "/images/customers/picing-logos/brevo.png" },
      
    ],
    "Enterprise": [
      { name: "Khan Academy", logo: "/images/customers/picing-logos/khanacedemy.png" },
      //{ name: "Cinc Systems", logo: "/images/customers/picing-logos/cincsystems.png" },
      //{ name: "HG Capital", logo: "/images/customers/picing-logos/hgcapital.png" },
      //{ name: "Dixa", logo: "/images/customers/picing-logos/dixa.png" },
    ],
  },
}; 