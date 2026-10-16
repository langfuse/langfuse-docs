import assert from "node:assert/strict";
import test from "node:test";
import { CLASSIFIERS } from "./criteria";
import {
  asChoiceAnswer,
  buildDecisionsRequest,
  mapDecisionsAnswers,
  type DecisionAnswer,
} from "./decisionsMapping";

const sentiment = CLASSIFIERS.sentiment;
const urgency = CLASSIFIERS.urgency;

const choice = (
  name: string,
  value: string,
  confidence: number,
  probabilities: Record<string, number>,
): DecisionAnswer => ({
  type: "choice",
  name,
  choice: value,
  confidence,
  probabilities: Object.entries(probabilities).map(([v, probability]) => ({
    value: v,
    probability,
  })),
});

test("buildDecisionsRequest maps classifiers to named choice questions", () => {
  const request = buildDecisionsRequest("great product", [sentiment, urgency]);
  assert.equal(request.model, "gpt-6-luna");
  assert.equal(request.input, "great product");
  assert.equal(request.questions.length, 2);
  assert.equal(request.questions[0].name, "sentiment");
  assert.equal(request.questions[0].type, "choice");
  assert.deepEqual(
    request.questions[0].choices.map((c) => c.value),
    Object.keys(sentiment.criteria),
  );
  assert.equal(request.questions[1].name, "urgency");
});

test("mapDecisionsAnswers matches by name when answers arrive out of order", () => {
  const answers = mapDecisionsAnswers(
    [sentiment, urgency],
    [
      choice("urgency", "high", 0.91, { low: 0.02, medium: 0.07, high: 0.91 }),
      choice("sentiment", "positive", 0.88, {
        positive: 0.88,
        negative: 0.05,
        neutral: 0.07,
      }),
    ],
  );

  assert.equal(answers.length, 2);
  assert.equal(answers[0].id, "sentiment");
  assert.equal(answers[0].value, "positive");
  assert.equal(answers[0].confidence, 0.88);
  assert.equal(answers[0].probabilities.positive, 0.88);
  assert.equal(answers[1].id, "urgency");
  assert.equal(answers[1].value, "high");
  assert.equal(answers[1].probabilities.medium, 0.07);
});

test("mapDecisionsAnswers fills missing probability labels with 0", () => {
  const [answer] = mapDecisionsAnswers(
    [sentiment],
    [
      choice("sentiment", "neutral", 0.6, {
        // negative omitted on purpose
        positive: 0.2,
        neutral: 0.6,
      }),
    ],
  );
  assert.equal(answer.probabilities.negative, 0);
  assert.equal(answer.probabilities.neutral, 0.6);
});

test("mapDecisionsAnswers throws when an answer is missing", () => {
  assert.throws(
    () =>
      mapDecisionsAnswers(
        [sentiment, urgency],
        [choice("sentiment", "positive", 0.9, { positive: 0.9 })],
      ),
    /did not return an answer for "urgency"/,
  );
});

test("mapDecisionsAnswers throws on refusal answers", () => {
  assert.throws(
    () =>
      mapDecisionsAnswers(
        [sentiment],
        [{ type: "refusal", name: "sentiment" }],
      ),
    /refused to answer "sentiment"/,
  );
});

test("asChoiceAnswer rejects non-choice upstream payloads", () => {
  assert.throws(
    () => asChoiceAnswer({ type: "score", name: "sentiment" }, "sentiment"),
    /did not return a choice answer for "sentiment"/,
  );
  assert.throws(
    () => asChoiceAnswer(undefined, "sentiment"),
    /did not return an answer for "sentiment"/,
  );
});
