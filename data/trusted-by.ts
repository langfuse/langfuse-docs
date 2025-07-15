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
      { name: "Knowunity", logo: "/images/customers/picing-logos/knowunity.png" },
      { name: "Draftbit", logo: "/images/customers/picing-logos/draftbit.png" },
      { name: "Kombo", logo: "/images/customers/picing-logos/kombo.png" },
      //{ name: "GoDaddy", logo: "/images/customers/picing-logos/godaddy.png" },
    ],
    "Pro": [
      { name: "Twilio", logo: "/images/customers/picing-logos/twilio.png" },
      { name: "Khan Academy", logo: "/images/customers/picing-logos/khanacedemy.png" },
      { name: "SumUp", logo: "/images/customers/picing-logos/sumup.png" },
      //{ name: "Brevo", logo: "/images/customers/picing-logos/brevo.png" },
      
    ],
    "Enterprise": [
      { name: "Cinc Systems", logo: "/images/customers/picing-logos/cincsystems.png" },
      { name: "HG Capital", logo: "/images/customers/picing-logos/hgcapital.png" },
      //{ name: "Dixa", logo: "/images/customers/picing-logos/dixa.png" },
    ],
  },
}; 