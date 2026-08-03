import { NextRequest, NextResponse } from "next/server";
import {
  buildDocsWebsiteFeedbackMessage,
  sendFeedbackToSlack,
} from "@/lib/feedback-slack";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      page?: unknown;
      feedback?: unknown;
      comment?: unknown;
    };

    const page = typeof body.page === "string" ? body.page : "";
    const rating = typeof body.feedback === "string" ? body.feedback : "";
    const comment =
      typeof body.comment === "string" && body.comment.trim().length > 0
        ? body.comment
        : undefined;

    if (!page || !["positive", "negative"].includes(rating)) {
      return NextResponse.json({}, { status: 400, statusText: "Bad Request" });
    }

    await sendFeedbackToSlack(
      buildDocsWebsiteFeedbackMessage({ page, rating, comment }),
    );

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}
