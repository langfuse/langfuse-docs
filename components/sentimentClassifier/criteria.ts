/** Shared sentiment rubric for Jev Choice criteria and the Luna system prompt. */

export const SENTIMENT_INSTRUCTIONS =
  "What is the overall sentiment of this text?";

export const SENTIMENT_CRITERIA = {
  positive:
    "The text expresses approval, satisfaction, praise, or other favorable feelings.",
  negative:
    "The text expresses disapproval, frustration, complaint, or other unfavorable feelings.",
  neutral:
    "The text is factual, informational, or does not lean clearly positive or negative.",
} as const;

export type SentimentLabel = keyof typeof SENTIMENT_CRITERIA;

export const LLM_SENTIMENT_SYSTEM_PROMPT = `You are a careful sentiment classifier.

Classify the user's text as exactly one of: positive, negative, or neutral.

Criteria:
- positive: ${SENTIMENT_CRITERIA.positive}
- negative: ${SENTIMENT_CRITERIA.negative}
- neutral: ${SENTIMENT_CRITERIA.neutral}

Also return:
- confidence: a score between 0 and 1
- explanation: a brief explanation of your reasoning
- keyPhrases: the key phrases from the text that influenced your classification

Think carefully about sarcasm, mixed signals, and ambiguous wording before deciding.`;
