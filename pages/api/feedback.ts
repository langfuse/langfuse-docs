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
    if (!process.env.WEBSITE_FEEDBACK_WEBHOOK)
      throw new Error("WEBSITE_FEEDBACK_WEBHOOK is not set");

    const body = await req.json();

    const webhookResponse = await fetch(process.env.WEBSITE_FEEDBACK_WEBHOOK, {
      method: "POST",
      body: JSON.stringify({
        type: "docs-feedback",
        ...body,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (webhookResponse.status === 200) {
      return NextResponse.json({ status: "OK" });
    } else {
      console.error(webhookResponse);
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
