import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";

export type SentimentLabel = "positive" | "negative" | "neutral";

export type JevSentimentResult = {
  sentiment: SentimentLabel;
  confidence: number;
  probabilities: Record<SentimentLabel, number>;
  model: string;
};

export type LlmSentimentResult = {
  sentiment: SentimentLabel;
  confidence: number;
  explanation: string;
  keyPhrases: string[];
};

export type SentimentEngine = "jev" | "llm";

export const ENGINE_CONFIG: Record<
  SentimentEngine,
  { endpoint: string; loading: string; label: string }
> = {
  jev: {
    endpoint: "/api/sentiment-classifier",
    loading: "Classifying with Jev...",
    label: "TypeSafe Jev",
  },
  llm: {
    endpoint: "/api/sentiment-classifier-llm",
    loading: "Classifying with GPT-4o-mini...",
    label: "GPT-4o mini",
  },
};

export const EXAMPLE_TEXTS = [
  "The product quality exceeded all my expectations. Customer service was incredibly helpful and responsive!",
  "I'm extremely disappointed with the delivery. The package arrived damaged and two weeks late.",
  "The meeting is scheduled for 3pm in conference room B. Please bring your laptop.",
];

export const SENTIMENT_ORDER: SentimentLabel[] = [
  "positive",
  "neutral",
  "negative",
];

export const SENTIMENT_COLORS: Record<
  SentimentLabel,
  { bg: string; text: string; bar: string }
> = {
  positive: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    bar: "bg-green-500",
  },
  negative: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    bar: "bg-red-500",
  },
  neutral: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    bar: "bg-yellow-500",
  },
};

export const getPersistedSentimentUserId = () =>
  getPersistedNanoId({
    key: "sentiment-classifier-user-id",
    prefix: "u-",
  });

export async function classifySentiment(
  engine: SentimentEngine,
  text: string,
  userId: string,
): Promise<
  | {
      ok: true;
      data: {
        result: JevSentimentResult | LlmSentimentResult;
        traceId: string;
      };
    }
  | { ok: false; error: string }
> {
  try {
    const res = await fetch(ENGINE_CONFIG[engine].endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, userId }),
    });

    const responseText = await res.text();
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      return { ok: false, error: "Invalid response from server" };
    }

    if (!res.ok) {
      return {
        ok: false,
        error: data.error ?? `Request failed (${res.status})`,
      };
    }

    return {
      ok: true,
      data: { result: data.result, traceId: data.traceId },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "An error occurred",
    };
  }
}
