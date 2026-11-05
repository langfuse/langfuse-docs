import OpenAI, { toFile } from "openai";
import { consultantAudio } from "@/lib/consultant/transcribe.mjs";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const unavailable =
  "Dictation is unavailable right now. Try again in a moment.";

export async function POST(req: Request) {
  const { success } = rateLimit(req, { limit: 6, windowMs: 60_000 });
  if (!success) {
    return Response.json(
      { error: "Too many recordings. Wait a minute and try again." },
      { status: 429 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: unavailable }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json(
      { error: "Record a short message and try again." },
      { status: 400 },
    );
  }

  const audio = form.get("audio");
  if (!(audio instanceof File)) {
    return Response.json(
      { error: "Record a short message and try again." },
      { status: 400 },
    );
  }

  const checked = consultantAudio(audio);
  if ("error" in checked) {
    return Response.json({ error: checked.error }, { status: 400 });
  }

  try {
    const client = new OpenAI();
    const file = await toFile(
      Buffer.from(await audio.arrayBuffer()),
      `turn.${checked.ext}`,
      {
        type: checked.mime,
      },
    );
    const result = await client.audio.transcriptions.create({
      file,
      model: "gpt-transcribe",
    });
    const text = typeof result.text === "string" ? result.text.trim() : "";
    if (!text) {
      return Response.json(
        { error: "No speech detected. Try again." },
        { status: 422 },
      );
    }
    return Response.json({ text: text.slice(0, 4_000) });
  } catch {
    return Response.json({ error: unavailable }, { status: 502 });
  }
}
