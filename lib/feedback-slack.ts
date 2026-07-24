// Shared Slack delivery for docs feedback (website widget + docs MCP tool).
// WEBSITE_FEEDBACK_WEBHOOK must be a Slack incoming webhook; it points at the
// same channel as the Langfuse app's feedback intake, so the message format
// mirrors web/src/features/feedback/server/FeedbackService.ts in langfuse.

type SlackTextObject = {
  type: "plain_text" | "mrkdwn";
  text: string;
  emoji?: boolean;
};

type SlackBlock =
  | { type: "header"; text: SlackTextObject }
  | { type: "section"; text: SlackTextObject }
  | { type: "section"; fields: SlackTextObject[] }
  | { type: "divider" }
  | { type: "context"; elements: SlackTextObject[] };

type SlackPayload = {
  text: string;
  blocks?: SlackBlock[];
  unfurl_links: false;
  unfurl_media: false;
};

const SLACK_SECTION_TEXT_LIMIT = 3000;
const SLACK_FIELD_TEXT_LIMIT = 2000;
const FEEDBACK_SLACK_TIMEOUT_MS = 5_000;

const truncateForSlack = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 14))}\n[truncated]`;
};

const plainText = (value: string, maxLength: number): SlackTextObject => ({
  type: "plain_text",
  text: truncateForSlack(value, maxLength),
  emoji: false,
});

const mrkdwnText = (value: string): SlackTextObject => ({
  type: "mrkdwn",
  text: value,
});

const appendPlainTextSection = (
  blocks: SlackBlock[],
  label: string,
  value: string | undefined,
) => {
  if (!value) return;

  blocks.push(
    { type: "section", text: mrkdwnText(`*${label}*`) },
    { type: "section", text: plainText(value, SLACK_SECTION_TEXT_LIMIT) },
  );
};

const buildFullMessage = ({
  source,
  headerFields,
  sections,
  footer,
}: {
  source: string;
  headerFields: Array<[label: string, value: string]>;
  sections: Array<[label: string, value: string | undefined]>;
  footer: string[];
}): SlackPayload => {
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "💬 New Langfuse feedback",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: headerFields.map(([label, value]) =>
        plainText(`${label}:\n${value}`, SLACK_FIELD_TEXT_LIMIT),
      ),
    },
    { type: "divider" },
  ];

  for (const [label, value] of sections) {
    appendPlainTextSection(blocks, label, value);
  }

  blocks.push(
    { type: "divider" },
    {
      type: "context",
      elements: footer.map((element) =>
        plainText(element, SLACK_FIELD_TEXT_LIMIT),
      ),
    },
  );

  return {
    text: `New Langfuse feedback · ${source}`,
    blocks,
    unfurl_links: false,
    unfurl_media: false,
  };
};

export const buildDocsMcpFeedbackMessage = (input: {
  id: string;
  targetType: string;
  target: string;
  feedback: string;
  goal?: string;
  referenceUrl?: string;
}): SlackPayload =>
  buildFullMessage({
    source: `Langfuse Docs MCP · ${input.targetType} · ${input.id}`,
    headerFields: [
      ["📬 SOURCE", "Langfuse Docs MCP"],
      ["🎯 TARGET", input.target],
      ["🧩 TARGET TYPE", input.targetType],
      ["🌍 REGION", "docs"],
    ],
    sections: [
      ["💬 Feedback:", input.feedback],
      ["🎯 Goal / use case:", input.goal],
      ["🔗 Reference URL:", input.referenceUrl],
    ],
    footer: [`🧾 Receipt: ${input.id}`],
  });

export const buildDocsWebsiteFeedbackMessage = (input: {
  page: string;
  rating: string;
  comment?: string;
}): SlackPayload => {
  const ratingEmoji = input.rating === "positive" ? "👍" : "👎";

  // Bare thumbs ratings are frequent; keep them to a low-noise one-liner.
  if (!input.comment) {
    return {
      text: truncateForSlack(
        `${ratingEmoji} Docs page rating · ${input.page} · Langfuse Docs Website`,
        SLACK_SECTION_TEXT_LIMIT,
      ),
      unfurl_links: false,
      unfurl_media: false,
    };
  }

  return buildFullMessage({
    source: "Langfuse Docs Website",
    headerFields: [
      ["📬 SOURCE", "Langfuse Docs Website"],
      ["🎯 TARGET", input.page],
      ["🧩 TARGET TYPE", "docs"],
      ["⭐ RATING", `${ratingEmoji} ${input.rating}`],
    ],
    sections: [["💬 Feedback:", input.comment]],
    footer: ["🌍 Region: docs"],
  });
};

export async function sendFeedbackToSlack(
  payload: SlackPayload,
): Promise<void> {
  const webhookUrl = process.env.WEBSITE_FEEDBACK_WEBHOOK;
  if (!webhookUrl) {
    throw new Error("WEBSITE_FEEDBACK_WEBHOOK is not set");
  }

  const parsed = new URL(webhookUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "hooks.slack.com") {
    throw new Error("WEBSITE_FEEDBACK_WEBHOOK must be a Slack webhook");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(FEEDBACK_SLACK_TIMEOUT_MS),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook returned ${response.status}`);
  }
}
