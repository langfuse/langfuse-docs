import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  const imageData = (await fetch(
    new URL("../../public/icon256.png", import.meta.url)
  ).then((res) => res.arrayBuffer())) as string;
  const fontGeistMono = await fetch(
    new URL("../../lib/fonts/GeistMono-Medium.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const fontGeistSans = await fetch(
    new URL("../../lib/fonts/Geist-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const { searchParams } = new URL(request.url);

  // ?title=<title>
  const rawTitle = searchParams.has("title")
    ? searchParams.get("title")
    : undefined;
  const title = rawTitle ?? "Langfuse";

  const rawDescription = searchParams.has("description")
    ? searchParams.get("description")
    : undefined;
  const description = rawDescription
    ? rawDescription.length > 155
      ? rawDescription.slice(0, 155) + "..."
      : rawDescription
    : undefined;

  const section = searchParams.has("section")
    ? searchParams.get("section")
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          //backgroundImage: "radial-gradient(at center top, #283557, #000000)",
          backgroundColor: "#000000",
          fontFamily: "GeistSans",
          color: "#fff",
          padding: 0,
          fontWeight: 500,
          fontSize: 40,
        }}
      >
        {title !== "Langfuse" ? (
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              padding: 40,
              paddingLeft: 80,
              paddingRight: 80,
              borderBottom: "3px solid #aaa",
            }}
          >
            <img width="50" height="50" src={imageData} />
            <span style={{ fontWeight: 800 }}>
              Langfuse
              <span style={{ marginLeft: 10, fontWeight: 400 }}>
                – Open Source LLM Engineering Platform
              </span>
            </span>
          </div>
        ) : null}
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
        {
          name: "GeistMono",
          data: fontGeistMono,
          style: "normal",
        },
        {
          name: "GeistSans",
          data: fontGeistSans,
          style: "normal",
        },
      ],
    }
  );
}
