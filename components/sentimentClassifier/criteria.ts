/** Shared rubrics for Jev Choice questions and the Luna system prompts. */

export const CLASSIFIER_IDS = [
  "sentiment",
  "urgency",
  "intent",
  "action",
] as const;

export type ClassifierId = (typeof CLASSIFIER_IDS)[number];

export type ClassifierDefinition = {
  id: ClassifierId;
  name: string;
  instructions: string;
  criteria: Record<string, string>;
};

export const CLASSIFIERS: Record<ClassifierId, ClassifierDefinition> = {
  sentiment: {
    id: "sentiment",
    name: "Sentiment",
    instructions: "What is the overall sentiment of this text?",
    criteria: {
      positive:
        "The text expresses approval, satisfaction, praise, or other favorable feelings.",
      negative:
        "The text expresses disapproval, frustration, complaint, or other unfavorable feelings.",
      neutral:
        "The text is factual, informational, or does not lean clearly positive or negative.",
    },
  },
  urgency: {
    id: "urgency",
    name: "Urgency",
    instructions: "How urgently does this text need a response?",
    criteria: {
      low: "No time pressure. The text is informational or can wait.",
      medium: "Should be handled soon, but is not an emergency.",
      high: "Needs prompt attention: damage, delay, safety, billing, or explicit urgency.",
    },
  },
  intent: {
    id: "intent",
    name: "Intent",
    instructions: "What is the primary intent of this text?",
    criteria: {
      praise:
        "The writer is complimenting, thanking, or expressing satisfaction.",
      complaint:
        "The writer is reporting a problem, expressing dissatisfaction, or requesting a fix.",
      request:
        "The writer is asking for an action, information, or a change without primarily complaining.",
      informational:
        "The writer is sharing facts or logistics without asking for action or expressing evaluation.",
    },
  },
  action: {
    id: "action",
    name: "Next action",
    instructions: "What should happen next in response to this text?",
    criteria: {
      none: "No follow-up is needed.",
      reply: "A routine reply or acknowledgment is appropriate.",
      escalate:
        "This should be escalated to a human or a higher-priority queue.",
    },
  },
};

export const CLASSIFIER_SEQUENCE: ClassifierId[] = [...CLASSIFIER_IDS];

export const SENTIMENT_INSTRUCTIONS = CLASSIFIERS.sentiment.instructions;
export const SENTIMENT_CRITERIA = CLASSIFIERS.sentiment.criteria;
export type SentimentLabel = keyof typeof SENTIMENT_CRITERIA;

export function classifiersForCount(count: number): ClassifierDefinition[] {
  const n = Math.min(
    CLASSIFIER_SEQUENCE.length,
    Math.max(1, Math.round(count)),
  );
  return CLASSIFIER_SEQUENCE.slice(0, n).map((id) => CLASSIFIERS[id]);
}

export function parseClassifierIds(input: unknown): ClassifierDefinition[] {
  if (input == null) return [CLASSIFIERS.sentiment];

  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("tasks must be a non-empty array of classifier ids.");
  }

  const seen = new Set<ClassifierId>();
  const selected: ClassifierDefinition[] = [];

  for (const value of input) {
    if (typeof value !== "string" || !isClassifierId(value)) {
      throw new Error(
        `Unknown classifier "${String(value)}". Use ${CLASSIFIER_IDS.join(", ")}.`,
      );
    }
    if (seen.has(value)) continue;
    seen.add(value);
    selected.push(CLASSIFIERS[value]);
    if (selected.length >= CLASSIFIER_SEQUENCE.length) break;
  }

  return selected;
}

export function isClassifierId(value: string): value is ClassifierId {
  return (CLASSIFIER_IDS as readonly string[]).includes(value);
}

export function llmSystemPrompt(definition: ClassifierDefinition): string {
  const criteriaLines = Object.entries(definition.criteria)
    .map(([label, description]) => `- ${label}: ${description}`)
    .join("\n");

  return `You are a careful text classifier.

Classify the user's text as exactly one of: ${Object.keys(definition.criteria).join(", ")}.

Question: ${definition.instructions}

Criteria:
${criteriaLines}

Also return:
- confidence: a score between 0 and 1
- explanation: a brief explanation of your reasoning
- keyPhrases: the key phrases from the text that influenced your classification

Think carefully about sarcasm, mixed signals, and ambiguous wording before deciding.`;
}

export const LLM_SENTIMENT_SYSTEM_PROMPT = llmSystemPrompt(
  CLASSIFIERS.sentiment,
);
