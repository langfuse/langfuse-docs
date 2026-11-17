import { AccessToken } from "livekit-server-sdk";
import { rateLimit } from "@/lib/rateLimit";

// The demo UI sends a persisted nanoid such as `u-AbC123`.
const USER_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export const POST = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 5, windowMs: 60_000 });
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const livekitUrl = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({
        error:
          "Voice agent is not configured. LiveKit credentials are missing.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { userId?: unknown; storeAudio?: unknown };
  try {
    body = await req.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new TypeError("Body must be a JSON object");
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { userId, storeAudio } = body;
  if (typeof userId !== "string" || !USER_ID_PATTERN.test(userId)) {
    return new Response(JSON.stringify({ error: "Invalid userId." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // A fresh, unguessable room per conversation: room names end up as the
  // session ID on traces in the public demo project.
  const roomName = `voice-demo-${crypto.randomUUID()}`;
  const participantName = userId;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
    // Only needed to join; LiveKit refreshes tokens for connected participants.
    ttl: "10m",
    // Read by the agent to decide whether to record the conversation audio
    // and attach it to the Langfuse trace (defaults to true).
    attributes: { store_audio: String(storeAudio !== false) },
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await token.toJwt();

  return new Response(
    JSON.stringify({
      token: jwt,
      url: livekitUrl,
      roomName,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};

export const maxDuration = 10;
