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
    const loopsResponse = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      body: JSON.stringify({
        email,
        source,
        mailingLists: {
          cmbzj9z64074z0iyj7jj38ra6: true, //Product Updates Loops List
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      },
    });

    if (loopsResponse.status === 200 || loopsResponse.status === 409) {
      return NextResponse.json({ status: "OK" });
    } else {
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
