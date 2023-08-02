import { NextResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    if (req.method !== "POST")
      return NextResponse.json(
        {},
        {
          status: 400,
          statusText: "Bad Request - Only POST requests are allowed",
        }
      );
    if (!process.env.SLACK_WEBHOOK_FEEDBACK_URL)
      throw new Error("SLACK_WEBHOOK_FEEDBACK_URL is not set");

    const body = await req.json();

    const slackResponse = await fetch(process.env.SLACK_WEBHOOK_FEEDBACK_URL, {
      method: "POST",
      body: JSON.stringify({
        rawBody: JSON.stringify(
          {
            type: "docs-feedback",
            ...body,
          },
          null,
          2
        ),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (slackResponse.status === 200) {
      return NextResponse.json({ status: "OK" });
    } else {
      console.error(slackResponse);
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
        statusText: "Internal Server Error",
      }
    );
  }
}
