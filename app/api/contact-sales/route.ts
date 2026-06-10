import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  contactFormSchema,
  generateEmailContent,
  generateEmailHtmlContent,
} from "@/lib/contact-sales-form";

export async function POST(request: NextRequest) {
  const smtpUrl = process.env.SMTP_CONNECTION_URL;
  if (!smtpUrl) {
    console.error("SMTP_CONNECTION_URL is not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

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
    const emailContent = generateEmailContent(data);
    const emailHtmlContent = generateEmailHtmlContent(data);

    const transporter = nodemailer.createTransport(smtpUrl);

    await transporter.sendMail({
      from: "Langfuse <no-reply@notifications.langfuse.com>",
      to: `sales@langfuse.com, ${data.email}`,
      replyTo: "sales@langfuse.com",
      subject: `Langfuse - ${data.company}`,
      text: emailContent,
      html: emailHtmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
