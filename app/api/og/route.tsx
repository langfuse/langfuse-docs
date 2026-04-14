import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/** White wordmark PNG (2233×527); kept in sync from `public/langfuse-wordart-white.svg` via `scripts/sync-wordmark-png-for-og.mjs` (prebuild). */
const WORDMARK_PATH =
  "/brand-assets/wordmark/Langfuse/dark/langfuse-wordart-white.png";
const WORDMARK_ASPECT = 2233 / 527;

function wordmarkSize(heightPx: number) {
  return {
    height: heightPx,
    width: Math.round(heightPx * WORDMARK_ASPECT),
  };
}

export async function GET(request: NextRequest) {
  const base = new URL("/", request.url).toString();
  const wordmarkData = (await fetch(
    new URL(WORDMARK_PATH, base)
  ).then((res) => res.arrayBuffer())) as string;
  const fontGeistMono = await fetch(
    new URL("/fonts/GeistMono-Medium.ttf", base)
  ).then((res) => res.arrayBuffer());
  const fontInter = await fetch(
    new URL("/fonts/InterVariable.ttf", base)
  ).then((res) => res.arrayBuffer());

  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? undefined;
  const title = rawTitle ?? "Langfuse";

  const rawDescription = searchParams.get("description") ?? undefined;
  const description = rawDescription
    ? rawDescription.length > 155
      ? rawDescription.slice(0, 155) + "..."
      : rawDescription
    : undefined;

  const section = searchParams.get("section") ?? undefined;

  const headerWordmark = wordmarkSize(50);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          backgroundColor: "#000000",
          fontFamily: "Inter",
          color: "#fff",
          padding: 0,
          fontWeight: 500,
          fontSize: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            padding: 40,
            paddingLeft: 80,
            paddingRight: 80,
            borderBottom: "3px solid #aaa",
          }}
        >
          <img {...headerWordmark} src={wordmarkData} />
          <span style={{ fontWeight: 400, fontSize: 28, color: "#ccc" }}>
            Open Source LLM Engineering Platform
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
            padding: 80,
            paddingTop: 40,
          }}
        >
          {section ? (
            <div
              style={{
                fontWeight: 700,
                fontSize: 40,
                color: "#aaa",
                paddingBottom: "10px",
              }}
            >
              {section}
            </div>
          ) : null}
          <div
            style={{
              fontWeight: 500,
              fontSize: 60,
              lineHeight: "4rem",
              fontFamily: "GeistMono",
            }}
          >
            {title}
          </div>
          {description ? (
            <div style={{ color: "#ddd", paddingTop: "20px" }}>
              {description}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "GeistMono", data: fontGeistMono, style: "normal" },
        { name: "Inter", data: fontInter, style: "normal" },
      ],
    }
  );
}
