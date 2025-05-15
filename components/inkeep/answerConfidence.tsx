import type { JSONSchema } from "@inkeep/cxkit-react";

export const provideAnswerConfidenceSchema: JSONSchema = {
  type: "object",
  properties: {
    explanation: {
      type: "string",
      description:
        "A brief few word justification of why a specific confidence level was chosen.",
    },
    answerConfidence: {
      anyOf: [
        {
          type: "string",
          const: "very_confident",
          description:
            "\n    The AI Assistant provided a complete and direct answer to all parts of the User Question.\n    The answer fully resolved the issue without requiring any further action from the User.\n    Every part of the answer was cited from the information sources.\n    The assistant did not ask for more information or provide options requiring User action.\n    This is the highest Answer Confidence level and should be used sparingly.\n  ",
        },
        {
          type: "string",
          const: "somewhat_confident",
          description:
            "\n    The AI Assistant provided a complete and direct answer to the User Question, but the answer contained minor caveats or uncertainties. \n \n    Examples:\n    • The AI Assistant asked follow-up questions to the User\n    • The AI Assistant requested additional information from the User\n    • The AI Assistant suggested uncertainty in the answer\n    • The AI Assistant answered the question but mentioned potential exceptions\n  ",
        },
        {
          type: "string",
          const: "not_confident",
          description:
            "\n    The AI Assistant tried to answer the User Question but did not fully resolve it.\n    The assistant provided options requiring further action from the User, asked for more information, showed uncertainty,\n    suggested the user contact support or provided contact information, or provided an indirect or incomplete answer.\n    This is the most common Answer Confidence level.\n \n    Examples:\n    • The AI Assistant provided a general answer not directly related to the User Question\n    • The AI Assistant said to reach out to support or provided an email address or contact information\n    • The AI Assistant provided options that require further action from the User to resolve the issue\n  ",
        },
        {
          type: "string",
          const: "no_sources",
          description:
            "\n    The AI Assistant did not use or cite any sources from the information sources to answer the User Question.\n  ",
        },
        {
          type: "string",
          const: "other",
          description:
            "\n    The User Question is unclear or unrelated to the subject matter.\n  ",
        },
      ],
      description:
        "A measure of how confidently the AI Assistant completely and directly answered the User Question.",
    },
  },
  required: ["explanation", "answerConfidence"],
  additionalProperties: false,
};
