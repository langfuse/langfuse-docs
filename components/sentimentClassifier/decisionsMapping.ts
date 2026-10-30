import type { ClassifierDefinition } from "./criteria";
import type { ClassifierAnswer } from "./types";

export const DECISIONS_MODEL = "gpt-6-luna";

export type DecisionChoiceOption = {
  value: string;
  description: string;
};

export type DecisionChoiceQuestion = {
  type: "choice";
  name: string;
  instructions: string;
  choices: DecisionChoiceOption[];
};

export type DecisionChoiceProbability = {
  value: string;
  probability: number;
};

export type DecisionChoiceAnswer = {
  type: "choice";
  name: string;
  choice: string;
  confidence: number;
  probabilities: DecisionChoiceProbability[];
};

export type DecisionRefusalAnswer = {
  type: "refusal";
  name?: string;
};

export type DecisionAnswer =
  | DecisionChoiceAnswer
  | DecisionRefusalAnswer
  | {
      type: string;
      name?: string;
    };

/** Build the OpenAI Decisions API request body for the selected classifiers. */
export const buildDecisionsRequest = (
  text: string,
  selected: ClassifierDefinition[],
) => ({
  model: DECISIONS_MODEL,
  input: text,
  questions: selected.map(
    (definition): DecisionChoiceQuestion => ({
      type: "choice",
      name: definition.id,
      instructions: definition.instructions,
      choices: Object.entries(definition.criteria).map(
        ([value, description]) => ({
          value,
          description,
        }),
      ),
    }),
  ),
});

export const asChoiceAnswer = (
  answer: DecisionAnswer | undefined,
  id: string,
): DecisionChoiceAnswer => {
  if (!answer) {
    throw new Error(
      `OpenAI Decisions API did not return an answer for "${id}".`,
    );
  }
  if (answer.type === "refusal") {
    throw new Error(
      `OpenAI Decisions API refused to answer "${id}"${
        answer.name ? ` (${answer.name})` : ""
      }.`,
    );
  }
  if (
    answer.type !== "choice" ||
    typeof (answer as DecisionChoiceAnswer).choice !== "string" ||
    typeof (answer as DecisionChoiceAnswer).confidence !== "number" ||
    !Array.isArray((answer as DecisionChoiceAnswer).probabilities)
  ) {
    throw new Error(
      `OpenAI Decisions API did not return a choice answer for "${id}".`,
    );
  }
  return answer as DecisionChoiceAnswer;
};

/**
 * Map Decisions API answers onto the selected classifiers by name.
 * Answers may arrive out of order; missing / refused / non-choice answers throw.
 */
export const mapDecisionsAnswers = (
  selected: ClassifierDefinition[],
  answers: DecisionAnswer[] | undefined,
): ClassifierAnswer[] => {
  const answersByName = new Map(
    (answers ?? []).map((answer) => [answer.name ?? "", answer]),
  );

  return selected.map((definition) => {
    const answer = asChoiceAnswer(
      answersByName.get(definition.id),
      definition.id,
    );
    const probabilities = Object.fromEntries(
      Object.keys(definition.criteria).map((label) => {
        const match = answer.probabilities.find((item) => item.value === label);
        return [label, match?.probability ?? 0];
      }),
    );
    return {
      id: definition.id,
      name: definition.name,
      value: answer.choice,
      confidence: answer.confidence,
      probabilities,
    };
  });
};
