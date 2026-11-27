import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const emailSchema = z.string().email();

const sourceSchema = z.string().max(100).optional();

const eventNameSchema = z.enum(["india_cloud_waitlist"]).optional();

const mailingListSchema = z.enum(["product", "oss", "gateway"]);

const listsSchema = z.array(mailingListSchema).min(1).max(3);

// Loops mailing list IDs.
// - `product`: general monthly product update newsletter.
// - `oss`: self-hosting / open source feature updates.
// - `gateway`: Langfuse AI Gateway updates.
const MAILING_LISTS: Record<z.infer<typeof mailingListSchema>, string> = {
  product: "cmbzj9z64074z0iyj7jj38ra6",
  oss: "cmrxmvmg80x8z0j40drdb1v3y",
  gateway: "cmwwalm1wbrfs0kvr8scubes7",
};

// Self-hosted Langfuse instances call this route from the user's browser.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function loopsRequest(method: "POST" | "PUT", path: string, body: object) {
  return fetch(`https://app.loops.so/api/v1/${path}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, list, lists, eventName } = body;

    if (!emailSchema.safeParse(email).success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!sourceSchema.safeParse(source).success) {
      return NextResponse.json(
        { error: "Invalid source" },
        { status: 400, headers: corsHeaders },
      );
    }

    const parsedEventName = eventNameSchema.safeParse(eventName);
    if (!parsedEventName.success) {
      return NextResponse.json(
        { error: "Invalid event name" },
        { status: 400, headers: corsHeaders },
      );
    }

    // The website forms send a single `list`; unknown values fall back to `product`.
    const parsedLists = listsSchema.safeParse(
      lists === undefined
        ? [mailingListSchema.safeParse(list).data ?? "product"]
        : lists,
    );
    if (!parsedLists.success) {
      return NextResponse.json(
        { error: "Invalid mailing lists" },
        { status: 400, headers: corsHeaders },
      );
    }

    const mailingLists = Object.fromEntries(
      parsedLists.data.map((key) => [MAILING_LISTS[key], true]),
    );

    // Create first so `source` is only set on new contacts; an existing
    // contact (409) gets the lists added and keeps its original source.
    const createResponse = await loopsRequest("POST", "contacts/create", {
      email,
      source,
      mailingLists,
    });
    const loopsResponse =
      createResponse.status === 409
        ? await loopsRequest("PUT", "contacts/update", { email, mailingLists })
        : createResponse;

    if (loopsResponse.status !== 200) {
      console.error("Loops", await loopsResponse.text());
      return NextResponse.json(
        {},
        {
          status: 500,
          statusText: "Internal Server Error",
          headers: corsHeaders,
        },
      );
    }

    // Record allowlisted custom events (e.g. region waitlist signups) for both
    // new and existing contacts without overwriting an existing contact's source.
    if (parsedEventName.data) {
      const eventResponse = await loopsRequest("POST", "events/send", {
        email,
        eventName: parsedEventName.data,
      });

      if (eventResponse.status !== 200) {
        console.error("Loops event", await eventResponse.text());
        return NextResponse.json(
          {},
          {
            status: 500,
            statusText: "Internal Server Error",
            headers: corsHeaders,
          },
        );
      }
    }

    return NextResponse.json({ status: "OK" }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    // Fixed status line: error messages can echo the request body.
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
        headers: corsHeaders,
      },
    );
  }
}
