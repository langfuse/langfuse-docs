import { LangfuseWeb } from "langfuse";

export const demoLangfuseWebClients = [
  new LangfuseWeb({
    baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
    publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  }),
  new LangfuseWeb({
    baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
    publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  }),
  new LangfuseWeb({
    baseUrl: process.env.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL,
    publicKey: process.env.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY,
  }),
  new LangfuseWeb({
    baseUrl: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_BASE_URL,
    publicKey: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_PUBLIC_KEY,
  }),
];
