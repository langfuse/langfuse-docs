import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  const imageData = (await fetch(
    new URL("../../public/assistme.svg", import.meta.url)
  ).then((res) => res.arrayBuffer())) as string;

  const { searchParams } = new URL(request.url);

  // ?title=<title>
  const rawTitle = searchParams.has("title")
    ? searchParams.get("title")
    : undefined;
  const title = rawTitle ?? "AssistMe";

  const rawDescription = searchParams.has("description")
    ? searchParams.get("description")
    : undefined;
  const description = rawDescription
    ? rawDescription.length > 150
      ? rawDescription.slice(0, 150) + "..."
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
          backgroundImage: "radial-gradient(at center top, #283557, #000000)",
          color: "#fff",
          padding: 0,
          fontWeight: 500,
          fontSize: 40,
          fontFamily: "sans-serif",
        }}
      >
        {title !== "AssistMe" ? (
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              padding: 40,
              paddingLeft: 80,
              paddingRight: 80,
              borderBottom: "3px solid white",
            }}
          >
            <img width="50" height="50" src={imageData} />
            <span style={{ fontWeight: 800 }}>
              AssistMe
              <span style={{ marginLeft: 10, fontWeight: 400 }}>
                – Open source analytics for LLM Apps
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
          <div style={{ fontWeight: 700, fontSize: 60, lineHeight: "3.5rem" }}>
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
    }
  );
}
