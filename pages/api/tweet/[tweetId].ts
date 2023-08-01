import { NextResponse, type NextRequest } from "next/server";
import { getTweet } from "react-tweet/api";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tweetId = searchParams.get("tweetId");

  if (req.method !== "GET" || typeof tweetId !== "string") {
    return NextResponse.json(
      {},
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  try {
    const tweet = await getTweet(tweetId);

    if (!tweet)
      return NextResponse.json(undefined, {
        status: 404,
        statusText: "Not Found",
      });

    return NextResponse.json(
      { data: tweet },
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: error.message ?? "Internal Server Error",
      }
    );
  }
}
