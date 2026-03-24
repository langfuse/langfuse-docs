import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
  const livekitUrl = process.env.LIVEKIT_URL;
  const livekitApiKey = process.env.LIVEKIT_API_KEY;
  const livekitApiSecret = process.env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !livekitApiKey || !livekitApiSecret) {
    return NextResponse.json(
      { error: "Voice agent is not configured" },
      { status: 503 }
    );
  }

  try {
    const { userId } = await _request.json();

    const { AccessToken } = await import("livekit-server-sdk");

    const roomName = `voice-agent-${userId ?? "guest"}`;
    const at = new AccessToken(livekitApiKey, livekitApiSecret, {
      identity: userId ?? "guest",
    });
    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
    const token = await at.toJwt();

    return NextResponse.json({ token, url: livekitUrl, room: roomName });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create token" },
      { status: 500 }
    );
  }
}
