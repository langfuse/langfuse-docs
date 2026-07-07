import { NextRequest, NextResponse } from "next/server";
import {
  BUILDING_OPTIONS,
  DEPLOYMENT_OPTIONS,
  LLM_APP_COUNT_OPTIONS,
  USER_COUNT_OPTIONS,
  contactFormSchema,
  getContactFormCurrentSetupLabel,
  getContactFormOptionLabel,
  type ContactFormData,
} from "@/lib/contact-sales-form";

const MARKETO_IDENTITY =
  "https://238-FPC-317.mktorest.com/identity/oauth/token";
const MARKETO_REST = "https://238-FPC-317.mktorest.com/rest/v1/leads.json";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

class MarketoConfigError extends Error {}

class MarketoApiError extends Error {
  constructor(
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new MarketoConfigError(`${name} is not configured`);
  }

  return value;
}

async function readResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function getMarketoToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const tokenUrl = new URL(MARKETO_IDENTITY);
  tokenUrl.searchParams.set("grant_type", "client_credentials");
  tokenUrl.searchParams.set("client_id", getRequiredEnv("MARKETO_CLIENT_ID"));
  tokenUrl.searchParams.set(
    "client_secret",
    getRequiredEnv("MARKETO_CLIENT_SECRET"),
  );

  const response = await fetch(tokenUrl, {
    method: "GET",
    cache: "no-store",
  });
  const data = await readResponseBody(response);

  if (
    !response.ok ||
    !isRecord(data) ||
    typeof data.access_token !== "string"
  ) {
    throw new MarketoApiError("Failed to get Marketo token", data);
  }

  const expiresIn =
    typeof data.expires_in === "number" ? data.expires_in : 3600;

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + Math.max(expiresIn - 60, 0) * 1000;

  return cachedToken;
}

function getMarketoLeadInput(data: ContactFormData) {
  return {
    email: data.email,
    mktoName: data.name,
    company: data.company,
    miscBlankField1: getContactFormOptionLabel(BUILDING_OPTIONS, data.building),
    miscBlankField2: getContactFormCurrentSetupLabel(data),
    miscBlankField3TextArea: getContactFormOptionLabel(
      LLM_APP_COUNT_OPTIONS,
      data.productionAppCount,
    ),
    miscBlankField4TextArea: getContactFormOptionLabel(
      LLM_APP_COUNT_OPTIONS,
      data.plannedAppCount,
    ),
    miscBlankField5TextArea: getContactFormOptionLabel(
      DEPLOYMENT_OPTIONS,
      data.deployment,
    ),
    miscBlankField6TextArea: getContactFormOptionLabel(
      USER_COUNT_OPTIONS,
      data.userCount,
    ),
    last_message_on_the_form__c: data.message,
  };
}

async function submitLeadToMarketo(data: ContactFormData, token: string) {
  const response = await fetch(MARKETO_REST, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "createOrUpdate",
      lookupField: "email",
      input: [getMarketoLeadInput(data)],
    }),
    cache: "no-store",
  });
  const result = await readResponseBody(response);

  if (!response.ok) {
    throw new MarketoApiError("Marketo request failed", result);
  }

  if (!isRecord(result) || result.success !== true) {
    throw new MarketoApiError("Marketo rejected the submission", result);
  }

  const leadResult = Array.isArray(result.result) ? result.result[0] : null;

  if (!isRecord(leadResult)) {
    throw new MarketoApiError("Marketo returned no lead result", result);
  }

  const leadStatus =
    typeof leadResult.status === "string" ? leadResult.status : "";
  const leadId = leadResult.id;

  if (
    leadStatus.toLowerCase() === "skipped" ||
    (typeof leadId !== "number" && typeof leadId !== "string")
  ) {
    throw new MarketoApiError("Marketo rejected the submission", result);
  }

  return leadId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = validationResult.data;
    const token = await getMarketoToken();
    await submitLeadToMarketo(data, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof MarketoConfigError) {
      console.error("Contact sales form is not configured:", error.message);

      return NextResponse.json(
        { error: "Contact form service not configured" },
        { status: 500 },
      );
    }

    if (error instanceof MarketoApiError) {
      console.error("Marketo contact form submission failed:", error.details);

      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 502 },
      );
    }

    console.error("Failed to submit contact sales form:", error);

    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 },
    );
  }
}
