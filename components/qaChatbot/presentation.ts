import type { ChatStatus, UIMessage } from "ai";

type Part = UIMessage["parts"][number];

export function isMessageSettled(status: ChatStatus, isLastMessage: boolean) {
  return !isLastMessage || (status !== "submitted" && status !== "streaming");
}

/** Keep tool-call narration inside reasoning without changing the API history. */
export function getPresentationParts(
  parts: Part[],
  isSettled: boolean,
): Part[] {
  const displayParts = parts.map((part) => ({ ...part }));
  const lastStepIndex = parts.findLastIndex(
    (part) =>
      part.type === "reasoning" ||
      part.type === "dynamic-tool" ||
      part.type === "step-start",
  );
  let reasoningIndex: number | undefined;

  parts.forEach((part, index) => {
    if (part.type === "step-start" || part.type === "dynamic-tool") {
      reasoningIndex = undefined;
    } else if (part.type === "reasoning") {
      reasoningIndex = index;
    } else if (
      part.type === "text" &&
      part.text.trim() &&
      (!isSettled || index < lastStepIndex)
    ) {
      // A finished text segment can still be followed by a tool call. Keep
      // unclassified text collapsed until the response finishes or is interrupted.
      if (reasoningIndex === undefined) {
        reasoningIndex = index;
        displayParts[index] = {
          type: "reasoning",
          text: part.text,
          state: part.state,
        };
      } else {
        const reasoning = displayParts[reasoningIndex];
        if (reasoning.type === "reasoning") {
          reasoning.text = [reasoning.text, part.text]
            .filter(Boolean)
            .join("\n\n");
          if (part.state === "streaming") reasoning.state = "streaming";
        }
        // Preserve original part indices so manually expanded steps retain
        // their identity as the response streams and the final answer appears.
        displayParts[index] = { ...part, text: "" };
      }
    }
  });

  return displayParts;
}
