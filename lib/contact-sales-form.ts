import { z } from "zod";

/**
 * Sanitizes a string for safe use in email headers by removing
 * newlines, carriage returns, and other control characters that
 * could be used for header injection attacks.
 */
function sanitizeForEmailHeader(input: string): string {
  return input
    .replace(/[\r\n\t]/g, " ") // Replace newlines and tabs with spaces
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, "") // Remove control characters
    .trim();
}

export const DEPLOYMENT_OPTIONS = [
  { value: "cloud", label: "Cloud" },
  { value: "self-hosted", label: "Self-hosted" },
  { value: "undecided", label: "Undecided" },
] as const;

export const BUILDING_OPTIONS = [
  {
    value: "customer-facing-ai",
    label: "Customer-facing AI product or agent (in or near production)",
  },
  {
    value: "internal-assistant",
    label: "Internal assistant/copilot for employees",
  },
  {
    value: "platform",
    label: "A platform serving multiple teams building with LLMs",
  },
  {
    value: "prototyping",
    label: "Still prototyping — nothing in production yet",
  },
] as const;

export const CURRENT_SETUP_OPTIONS = [
  { value: "langfuse-cloud", label: "Already using Langfuse Cloud" },
  {
    value: "langfuse-self-hosted",
    label: "Already self-hosting Langfuse (OSS)",
  },
  { value: "own-tooling", label: "Built our own tracing/eval tooling" },
  { value: "other-tool", label: "Using another tool" },
  { value: "nothing-yet", label: "Nothing yet" },
] as const;

export const LLM_APP_COUNT_OPTIONS = [
  { value: "0", label: "0" },
  { value: "1-5", label: "1–5" },
  { value: "6-20", label: "6–20" },
  { value: "20-plus", label: "20+" },
] as const;

export const USER_COUNT_OPTIONS = [
  { value: "1-5", label: "1–5" },
  { value: "6-25", label: "6–25" },
  { value: "26-100", label: "26–100" },
  { value: "100-plus", label: "100+" },
] as const;

export const FORM_FIELDS = {
  name: {
    name: "name" as const,
    label: "Name",
    placeholder: "John Doe",
    required: true,
  },
  email: {
    name: "email" as const,
    label: "Work email",
    placeholder: "your.name@acme.com",
    required: true,
  },
  company: {
    name: "company" as const,
    label: "Company name",
    placeholder: "Acme Inc.",
    required: true,
  },
  building: {
    name: "building" as const,
    label: "What are you building?",
    placeholder: "Select an option",
    required: true,
    options: BUILDING_OPTIONS,
  },
  currentSetup: {
    name: "currentSetup" as const,
    label: "Your current setup",
    placeholder: "Select an option",
    required: true,
    options: CURRENT_SETUP_OPTIONS,
  },
  currentSetupOther: {
    name: "currentSetupOther" as const,
    label: "Which tool?",
    placeholder: "e.g., LangSmith, Braintrust, custom internal tool...",
    required: false,
  },
  productionAppCount: {
    name: "productionAppCount" as const,
    label: "In production",
    placeholder: "Select",
    required: true,
    options: LLM_APP_COUNT_OPTIONS,
  },
  plannedAppCount: {
    name: "plannedAppCount" as const,
    label: "Planned in future",
    placeholder: "Select",
    required: true,
    options: LLM_APP_COUNT_OPTIONS,
  },
  deployment: {
    name: "deployment" as const,
    label: "Where do you want to run Langfuse?",
    placeholder: "Select an option",
    required: true,
    options: DEPLOYMENT_OPTIONS,
  },
  userCount: {
    name: "userCount" as const,
    label: "How many people would use Langfuse?",
    placeholder: "Select an option",
    required: true,
    options: USER_COUNT_OPTIONS,
  },
  message: {
    name: "message" as const,
    label: "What do you want to get out of the conversation?",
    placeholder:
      "e.g. We're scaling 3 agents to production and need better evals + cost tracking across teams.",
    required: true,
  },
} as const;

const optionValues = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value);

const optionValueSchema = <T extends readonly { value: string }[]>(
  options: T,
  message: string,
) =>
  z
    .string()
    .min(1, message)
    .refine((value) => optionValues(options).includes(value), message);

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const contactFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    email: z.string().email("Invalid email address").max(254),
    // Company is sanitized because it's used in the email subject header
    company: z
      .string()
      .min(1, "Company name is required")
      .max(200)
      .transform(sanitizeForEmailHeader),
    building: optionValueSchema(
      BUILDING_OPTIONS,
      "Please select what you are building",
    ),
    currentSetup: optionValueSchema(
      CURRENT_SETUP_OPTIONS,
      "Please select your current setup",
    ),
    currentSetupOther: z.string().max(200).optional(),
    productionAppCount: optionValueSchema(
      LLM_APP_COUNT_OPTIONS,
      "Please select current production usage",
    ),
    plannedAppCount: optionValueSchema(
      LLM_APP_COUNT_OPTIONS,
      "Please select planned usage",
    ),
    deployment: optionValueSchema(
      DEPLOYMENT_OPTIONS,
      "Please select a deployment option",
    ),
    userCount: optionValueSchema(
      USER_COUNT_OPTIONS,
      "Please select expected user count",
    ),
    message: z
      .string()
      .min(1, "Please tell us what you want to get out of the conversation")
      .max(5000),
  })
  .superRefine((data, ctx) => {
    if (data.currentSetup === "other-tool" && !data.currentSetupOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentSetupOther"],
        message: "Please tell us which tool you are using",
      });
    }
  });

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const defaultFormValues: ContactFormData = {
  name: "",
  email: "",
  company: "",
  building: "",
  currentSetup: "",
  currentSetupOther: "",
  productionAppCount: "",
  plannedAppCount: "",
  deployment: "",
  userCount: "",
  message: "",
};

function getEmailFields(data: ContactFormData) {
  const getLabel = <T extends readonly { value: string; label: string }[]>(
    options: T,
    value: string,
  ) => options.find((option) => option.value === value)?.label ?? value;

  return [
    { label: FORM_FIELDS.name.label, value: data.name },
    { label: FORM_FIELDS.email.label, value: data.email },
    { label: FORM_FIELDS.company.label, value: data.company },
    {
      label: FORM_FIELDS.building.label,
      value: getLabel(BUILDING_OPTIONS, data.building),
    },
    {
      label: FORM_FIELDS.currentSetup.label,
      value:
        getLabel(CURRENT_SETUP_OPTIONS, data.currentSetup) +
        (data.currentSetup === "other-tool" && data.currentSetupOther
          ? ` (${data.currentSetupOther})`
          : ""),
    },
    {
      label: "Agents/LLM features in production today",
      value: getLabel(LLM_APP_COUNT_OPTIONS, data.productionAppCount),
    },
    {
      label: "Agents/LLM features planned in the future",
      value: getLabel(LLM_APP_COUNT_OPTIONS, data.plannedAppCount),
    },
    {
      label: FORM_FIELDS.deployment.label,
      value: getLabel(DEPLOYMENT_OPTIONS, data.deployment),
    },
    {
      label: FORM_FIELDS.userCount.label,
      value: getLabel(USER_COUNT_OPTIONS, data.userCount),
    },
    { label: FORM_FIELDS.message.label, value: data.message },
  ];
}

export function formatFormDataForEmail(data: ContactFormData): string {
  return getEmailFields(data)
    .map((field) => `${field.label}\n${field.value}`)
    .join("\n\n");
}

export function formatFormDataForEmailHtml(data: ContactFormData): string {
  return getEmailFields(data)
    .map(
      (field) =>
        `<p><strong>${escapeHtml(field.label)}</strong><br />${escapeHtml(
          field.value,
        ).replace(/\r?\n/g, "<br />")}</p>`,
    )
    .join("\n");
}

export function generateEmailContent(data: ContactFormData): string {
  const formattedData = formatFormDataForEmail(data);

  return `Dear ${data.name},

Thanks for reaching out. We will respond shortly. Feel free to reply to this message if you want to add any additional context.

Best
Team Langfuse

---

Your request:

${formattedData}`;
}

export function generateEmailHtmlContent(data: ContactFormData): string {
  const formattedData = formatFormDataForEmailHtml(data);

  return `<p>Dear ${escapeHtml(data.name)},</p>

<p>Thanks for reaching out. We will respond shortly. Feel free to reply to this message if you want to add any additional context.</p>

<p>Best<br />Team Langfuse</p>

<hr />

<p>Your request:</p>

${formattedData}`;
}
