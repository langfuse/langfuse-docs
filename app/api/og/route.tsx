import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length <= maxChars) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function toDataUrl(buffer: ArrayBuffer, mime: string): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // `fromCharCode(...subarray)` can exceed the engine's max call/spread size on Edge; use `apply` with bounded chunks.
  const chunk = 0x2000; // 8192, safe for apply
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(
      null,
      sub as unknown as number[]
    );
  }
  return `data:${mime};base64,${btoa(binary)}`;
}


/**
 * Background image with decorators (light beige, geometric corner elements).
 * Replace public/og.png with the exported Figma background asset to activate decorators.
 */
const OG_BG_PATH = "/og-bg.png";

const CANVAS_W = 1200;
const CANVAS_H = 630;
/** Horizontal margin on each side of the content column. */
const SIDE_MARGIN = 85;
const CONTENT_W = CANVAS_W - SIDE_MARGIN * 2; // 1030
const TITLE_BOX_H = 200;
const DESC_BOX_H = 140;
const CONTENT_BOX_TOP = 150;
const BORDER_COLOR = "#cfcfc9";
const BG_COLOR = "#f6f6f3";

export async function GET(request: NextRequest) {
  const base = new URL("/", request.url).toString();
  // Try to load the background image (decorators); fall back gracefully if not present.
  const bgUrl = new URL(OG_BG_PATH, base);
  const [ogBgData, fontGeistMono, fontInter] = await Promise.all([
    fetch(bgUrl).then((r) => (r.ok ? r.arrayBuffer() : Promise.resolve(null))),
    fetch(new URL("/fonts/GeistMono-Medium.ttf", base)).then((r) => r.arrayBuffer()),
    fetch(new URL("/fonts/Inter-Medium.ttf", base)).then((r) => r.arrayBuffer()),
  ]);

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Langfuse";

  const rawDescription = searchParams.get("description") ?? undefined;
  const description = rawDescription
    ? rawDescription.length > 155
      ? rawDescription.slice(0, 155) + "..."
      : rawDescription
    : undefined;

  // Scale down title font if long to stay within the box
  const titleFontSize = title.length > 40 ? 58 : title.length > 28 ? 72 : 90;

  // Split title into lines for per-line highlight rendering (GeistMono char width ≈ 0.585 × fontSize)
  const charsPerLine = Math.floor((CONTENT_W - 64) / (titleFontSize * 0.585));
  const titleLines = wrapWords(title, charsPerLine);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: CANVAS_W,
          height: CANVAS_H,
          backgroundColor: BG_COLOR,
        }}
      >
        {/* Background with decorators — shown only when og-bg.png is present */}
        {ogBgData ? (
          <img
            src={toDataUrl(ogBgData, "image/png")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CANVAS_W,
              height: CANVAS_H,
            }}
          />
        ) : null}

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: SIDE_MARGIN,
            top: 0,
            width: CONTENT_W,
            height: CANVAS_H,
          }}
        >
          {/* Content box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: CONTENT_BOX_TOP,
              width: CONTENT_W,
            }}
          >
            {/* Title row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: TITLE_BOX_H,
                padding: "10px 32px",
              }}
            >
              {/* Each line gets its own highlight strip; gap creates space between lines */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                {titleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      fontFamily: "GeistMono",
                      fontWeight: 500,
                      fontSize: titleFontSize,
                      lineHeight: 0.76,
                      color: "#222220",
                      padding: "4px 10px",
                    }}
                  >
                    <mark style={{ backgroundColor: "#fbff7a" }}>
                      {line}
                    </mark>
                  </div>
                ))}
              </div>
            </div>

            {/* Description row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: DESC_BOX_H,
                padding: "10px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: "#3d3d38",
                  textAlign: "center",
                  maxWidth: 820,
                }}
              >
                {description ?? "Open Source LLM Engineering Platform"}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: 70,
              left: 0,
              right: 0,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: 16,
                color: "#3d3d38",
                textAlign: "center",
              }}
            >
              Langfuse—Open Source LLM Engineering Platform
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: CANVAS_W,
      height: CANVAS_H,
      fonts: [
        { name: "GeistMono", data: fontGeistMono, style: "normal" },
        { name: "Inter", data: fontInter, style: "normal" },
      ],
    }
  );
}
