import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.WEBSITE_FEEDBACK_WEBHOOK) {
      throw new Error("WEBSITE_FEEDBACK_WEBHOOK is not set");
    }

    const body = await request.json();

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
    }
    console.error(webhookResponse);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
