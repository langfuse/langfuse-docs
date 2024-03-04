import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

export const config = {
  runtime: "edge",
};

const emailSchema = z.string().email();

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      {},
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const body = await req.json();
  const { email, source } = body;

  // Validate email using zod
  if (!emailSchema.safeParse(email).success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  try {
    const [slackResponse, loopsResponse] = await Promise.all([
      fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({ rawMessage: JSON.stringify(body, null, 2) }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch("https://app.loops.so/api/v1/contacts/create", {
        method: "POST",
        body: JSON.stringify({
          email,
          source,
          receiveProductUpdates: true,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      }),
    ]);

    if (
      slackResponse.status === 200 &&
      (loopsResponse.status === 200 || loopsResponse.status === 409)
    ) {
      return NextResponse.json({ status: "OK" });
    } else {
      console.error("Slack", JSON.stringify(slackResponse));
      console.error("Loops", JSON.stringify(loopsResponse));
      return NextResponse.json(
        {},
        {
          status: 500,
          statusText: "Internal Server Error",
        }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: error.message ?? "Internal Server Error",
      }
    );
  }
}
