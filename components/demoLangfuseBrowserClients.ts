import {
  LangfuseBrowserClient,
  type LangfuseBrowserScoreBody,
} from "@langfuse/browser";

let clients: LangfuseBrowserClient[] | undefined;

const createClient = (publicKey?: string, baseUrl?: string) => {
  if (!publicKey) return null;

  return new LangfuseBrowserClient({
    publicKey,
    baseUrl,
  });
};

const getDemoLangfuseBrowserClients = () => {
  if (clients) return clients;

  clients = [
    createClient(
      process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
    ),
    createClient(
      process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
    ),
    createClient(
      process.env.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL,
    ),
    createClient(
      process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_BASE_URL,
    ),
  ].filter((client): client is LangfuseBrowserClient => client !== null);

  return clients;
};

export const scoreDemoFeedback = (score: LangfuseBrowserScoreBody) => {
  void Promise.allSettled(
    getDemoLangfuseBrowserClients().map((client) => client.score(score)),
  );
};
