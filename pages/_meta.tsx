export default {
  index: {
    type: "page",
    title: "Langfuse",
    display: "hidden",
    theme: {
      layout: "raw",
    },
  },
  wrapped: {
    type: "page",
    title: "Langfuse Wrapped 2025",
    display: "hidden",
    theme: {
      layout: "raw",
    },
  },
  imprint: {
    title: "Imprint",
    type: "page",
    display: "hidden",
  },
  "find-us": {
    title: "Find Us",
    type: "page",
    display: "hidden",
  },
  product: {
    title: "Product",
    type: "menu",
    items: {
      overview: {
        title: "Overview",
        href: "/docs",
      },
      observability: {
        title: "LLM Observability",
        href: "/docs/observability/overview",
      },
      prompts: {
        title: "Prompt Management",
        href: "/docs/prompt-management/overview",
      },
      evaluation: {
        title: "Evaluation",
        href: "/docs/evaluation/overview",
      },
    },
  },
  resources: {
    title: "Resources",
    type: "menu",
    items: {
      blog: {
        title: "Blog",
        href: "/blog",
      },
      changelog: {
        title: "Changelog",
        href: "/changelog",
      },
      roadmap: {
        title: "Roadmap",
        href: "/docs/roadmap",
      },
      customers: {
        title: "Customers",
        href: "/customers",
      },
      exampleproject: {
        title: "Example Project",
        href: "/docs/demo",
      },
      walkthroughs: {
        title: "Walkthroughs",
        href: "/watch-demo",
      },
      support: {
        title: "Support",
        href: "/support",
      },
    },
  },
  docs: {
    type: "page",
    title: "Docs",
  },
  "self-hosting": {
    type: "page",
    title: "Self Hosting",
    // hidden from main menu via overrides.css, nextra display:hidden otherwise breaks type:page
  },
  guides: {
    type: "page",
    title: "Guides",
    // hidden from main menu via overrides.css, nextra display:hidden otherwise breaks type:page
  },
  integrations: {
    type: "page",
    title: "Integrations",
    // hidden from main menu via overrides.css, nextra display:hidden otherwise breaks type:page
  },
  faq: {
    type: "page",
    title: "FAQ",
    // hidden from main menu via overrides.css, nextra display:hidden otherwise breaks type:page
  },
  handbook: {
    type: "page",
    title: "Handbook",
    // hidden from main menu via overrides.css, nextra display:hidden otherwise breaks type:page
  },
  changelog: {
    type: "page",
    title: "Changelog",
    theme: {
      layout: "full",
    },
  },
  pricing: {
    title: "Pricing",
    type: "page",
    theme: {
      layout: "full",
    },
  },
  "pricing-self-host": {
    title: "Pricing (self-hosted)",
    type: "page",
    theme: {
      layout: "full",
    },
    display: "hidden",
  },
  blog: {
    title: "Blog",
    type: "page",
    theme: {
      layout: "full",
    },
    display: "hidden",
  },
  customers: {
    title: "Customers",
    type: "page",
    display: "hidden",
    theme: {
      layout: "full",
    },
  },
  "watch-demo": {
    type: "page",
    title: "Watch Demo",
    display: "hidden",
    theme: {
      layout: "raw",
    },
  },
  "talk-to-us": {
    type: "page",
    title: "Talk to us",
    display: "hidden",
    theme: {
      layout: "raw",
    },
  },
  careers: {
    title: "Careers",
    type: "page",
    display: "hidden",
  },
  support: {
    title: "Support",
    type: "page",
    display: "hidden",
  },
  enterprise: {
    title: "Enterprise",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  startups: {
    title: "Startups",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  research: {
    title: "Research",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  library: {
    title: "Library",
    type: "page",
    theme: {
      typesetting: "article",
      breadcrumb: false,
    },
  },
  terms: {
    title: "Terms and Conditions",
    type: "page",
    display: "hidden",
  },
  privacy: {
    title: "Privacy Policy",
    type: "page",
    display: "hidden",
  },
  jp: {
    title: "Japanese Overview",
    type: "page",
    display: "hidden",
  },
  kr: {
    title: "Korean Overview",
    type: "page",
    display: "hidden",
  },
  cn: {
    title: "Chinese Overview",
    type: "page",
    display: "hidden",
  },
  community: {
    title: "Community",
    type: "page",
    display: "hidden",
  },
  events: {
    title: "Langfuse Events",
    type: "page",
    display: "hidden",
  },
  "cookie-policy": {
    title: "Cookie Policy",
    type: "page",
    display: "hidden",
  },
  "oss-friends": {
    title: "OSS Friends",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  about: {
    title: "About us",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  "open-source": {
    type: "page",
    title: "Open Source",
    display: "hidden",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  "404": {
    type: "page",
    theme: {
      typesetting: "article",
      timestamp: false,
    },
  },
  security: {
    type: "page",
    title: "Security & Compliance",
  },
};
