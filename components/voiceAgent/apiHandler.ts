import { observe, updateActiveTrace, getActiveTraceId } from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 5, windowMs: 60_000 });
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({
        error: "Voice agent is not configured. LiveKit credentials are missing.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const { userId }: { userId: string } = await req.json();

  const traceId = getActiveTraceId();

  updateActiveTrace({
    name: "Voice-Agent-Session",
    userId,
    input: { action: "create-session" },
  });

  // Dynamically import livekit-server-sdk to avoid build errors when not installed
  let AccessToken: any;
  try {
    // @ts-expect-error -- livekit-server-sdk is an optional dependency
    const livekitServerSdk = await import(/* webpackIgnore: true */ "livekit-server-sdk");
    AccessToken = livekitServerSdk.AccessToken;
  } catch {
    return new Response(
      JSON.stringify({
        error: "LiveKit server SDK is not installed.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const roomName = `voice-demo-${crypto.randomUUID()}`;
  const participantName = userId;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  const jwt = await token.toJwt();

  updateActiveTrace({
    output: { roomName, participantName },
  });

  after(async () => await flush());

  return new Response(
    JSON.stringify({
      token: jwt,
      url: livekitUrl,
      roomName,
      traceId,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const POST = observe(handler, {
  name: "voice-agent-token",
});

export const maxDuration = 10;
