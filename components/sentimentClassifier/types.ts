import type { ClassifierId } from "./criteria";
import type { SentimentUsage } from "./cost";

export type ClassifierAnswer = {
  id: ClassifierId;
  name: string;
  value: string;
  confidence: number;
  probabilities?: Record<string, number>;
  explanation?: string;
  keyPhrases?: string[];
};

export type ClassifierRunResult = {
  model: string;
  usage: SentimentUsage;
  answers: ClassifierAnswer[];
};
