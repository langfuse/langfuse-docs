import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const emailSchema = z.string().email();

// Loops mailing list IDs.
// - `product`: general monthly product update newsletter.
// - `oss`: self-hosting / open source feature updates.
const MAILING_LISTS: Record<string, string> = {
  product: "cmbzj9z64074z0iyj7jj38ra6",
  oss: "cmrxmvmg80x8z0j40drdb1v3y",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, list } = body;

    if (!emailSchema.safeParse(email).success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const mailingListId = MAILING_LISTS[list === "oss" ? "oss" : "product"];

    const loopsResponse = await fetch(
      "https://app.loops.so/api/v1/contacts/create",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          source,
          mailingLists: {
            [mailingListId]: true,
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      },
    );

    if (loopsResponse.status === 200 || loopsResponse.status === 409) {
      return NextResponse.json({ status: "OK" });
    }
    console.error("Loops", await loopsResponse.text());
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText:
          error instanceof Error ? error.message : "Internal Server Error",
      },
    );
  }
}
