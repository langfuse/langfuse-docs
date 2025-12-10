import * as z from "zod/v3";

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
  { value: "not-decided", label: "Not decided yet" },
  { value: "self-hosted", label: "Self-Hosted" },
  { value: "cloud", label: "Cloud (SaaS)" },
] as const;

export const ENTERPRISE_REQUIREMENTS = [
  { value: "none", label: "None (Want to use Core, Pro, Open Source)" },
  { value: "legal-dpa", label: "Need for custom legal terms or DPA" },
  {
    value: "security-review",
    label: "Must complete a security questionnaire/review",
  },
  {
    value: "high-usage",
    label: "Anticipate very high usage and need custom plan",
  },
  {
    value: "enterprise-features",
    label: "Need features in enterprise versions",
  },
  { value: "rfp", label: "Competitive RfP" },
] as const;

export const FORM_FIELDS = {
  name: {
    name: "name" as const,
    label: "Your name",
    placeholder: "John Doe",
    required: true,
  },
  email: {
    name: "email" as const,
    label: "Email address",
    placeholder: "john@company.com",
    required: true,
  },
  company: {
    name: "company" as const,
    label: "Company/Project",
    placeholder: "Acme Inc.",
    required: true,
  },
  message: {
    name: "message" as const,
    label: "What would you like to learn/understand in the conversation?",
    placeholder:
      "Please share anything that will help prepare for our meeting.",
    required: true,
  },
  usage: {
    name: "usage" as const,
    label: "How have you used Langfuse so far?",
    placeholder: "e.g., Evaluated the product, using in production...",
    required: true,
  },
  deployment: {
    name: "deployment" as const,
    label: "Where do you (want to) use Langfuse?",
    placeholder: "Select an option",
    required: true,
    options: DEPLOYMENT_OPTIONS,
  },
  userCount: {
    name: "userCount" as const,
    label: "How many users are you planning to onboard in the next 6 months?",
    placeholder: "e.g., 10, 50, 100+",
    required: true,
  },
  enterpriseRequirements: {
    name: "enterpriseRequirements" as const,
    label:
      "Do you have specific requirements that would necessitate the Enterprise version?",
    required: true,
    options: ENTERPRISE_REQUIREMENTS,
  },
  additionalNotes: {
    name: "additionalNotes" as const,
    label: "Additional Notes",
    placeholder:
      "Please share anything that will help prepare for our meeting.",
    required: false,
  },
} as const;

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address").max(254),
  // Company is sanitized because it's used in the email subject header
  company: z
    .string()
    .min(1, "Company/Project is required")
    .max(200)
    .transform(sanitizeForEmailHeader),
  message: z
    .string()
    .min(1, "Please tell us what you'd like to learn")
    .max(5000),
  usage: z.string().min(1, "Please describe your Langfuse usage").max(2000),
  deployment: z.string().min(1, "Please select a deployment option").max(100),
  userCount: z.string().min(1, "Please provide expected user count").max(100),
  enterpriseRequirements: z
    .array(z.string().max(100))
    .min(1, "Please select at least one option")
    .max(10),
  additionalNotes: z.string().max(5000).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const defaultFormValues: ContactFormData = {
  name: "",
  email: "",
  company: "",
  message: "",
  usage: "",
  deployment: "",
  userCount: "",
  enterpriseRequirements: [],
  additionalNotes: "",
};

export function formatFormDataForEmail(data: ContactFormData): string {
  const fields = [
    { label: FORM_FIELDS.name.label, value: data.name },
    { label: FORM_FIELDS.email.label, value: data.email },
    { label: FORM_FIELDS.company.label, value: data.company },
    { label: FORM_FIELDS.message.label, value: data.message },
    { label: FORM_FIELDS.usage.label, value: data.usage },
    {
      label: FORM_FIELDS.deployment.label,
      value:
        DEPLOYMENT_OPTIONS.find((o) => o.value === data.deployment)?.label ??
        data.deployment,
    },
    { label: FORM_FIELDS.userCount.label, value: data.userCount },
    {
      label: FORM_FIELDS.enterpriseRequirements.label,
      value: data.enterpriseRequirements
        .map(
          (v) => ENTERPRISE_REQUIREMENTS.find((o) => o.value === v)?.label ?? v
        )
        .join(", "),
    },
    {
      label: FORM_FIELDS.additionalNotes.label,
      value: data.additionalNotes || "N/A",
    },
  ];

  return fields.map((f) => `**${f.label}**\n${f.value}`).join("\n\n");
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
