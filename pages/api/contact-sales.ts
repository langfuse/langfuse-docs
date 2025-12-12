import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import {
  contactFormSchema,
  generateEmailContent,
} from "@/lib/contact-sales-form";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const smtpUrl = process.env.SMTP_CONNECTION_URL;
  if (!smtpUrl) {
    console.error("SMTP_CONNECTION_URL is not configured");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const validationResult = contactFormSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid form data",
        details: validationResult.error.flatten(),
      });
    }

    const data = validationResult.data;
    const emailContent = generateEmailContent(data);

    const transporter = nodemailer.createTransport(smtpUrl);

    await transporter.sendMail({
      from: "Langfuse <no-reply@notifications.langfuse.com>",
      to: `sales@langfuse.com, ${data.email}`,
      replyTo: "sales@langfuse.com",
      subject: `Langfuse - ${data.company}`,
      text: emailContent,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
