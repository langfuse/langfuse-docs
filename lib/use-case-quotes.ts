export const chatAgentQuoteRoutes = [
  "/users/sumup",
  "/users/canva",
  "/users/evolve",
] as const;

type QuoteExcerpt = {
  customerQuote: string;
  quoteAuthor?: string;
  quoteRole?: string;
  quoteAuthorImage?: string;
};

// Excerpts from the linked stories, shared by use-case cards and Markdown output.
// The customer index and story pages keep their original featured quotes.
export const useCaseQuoteExcerpts: Record<string, QuoteExcerpt> = {
  "/users/evolve": {
    customerQuote:
      "Users were telling the coach they'd already shared something days earlier. These patterns, you only find them when you do structured error analysis.",
  },
  "/users/hugging-face": {
    customerQuote:
      "Looking at the traces in Langfuse, I saw that running a single LLM call wasn't reliable enough.",
  },
  "/users/ravenna": {
    customerQuote:
      "It's probably multiple orders of magnitude faster than it would be without a tool like this.",
    quoteAuthor: "Kevin Coleman",
    quoteRole: "Co-founder",
    quoteAuthorImage: "/images/customers/ravenna/kevin-coleman.jpg",
  },
};
