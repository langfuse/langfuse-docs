export const runtime = "edge";

export default function GET(request: Request) {
  const headers = new Headers(request.headers);
  const continentCode = headers.get("x-vercel-ip-continent");

  console.log("continentCode", continentCode);

  return new Response(
    JSON.stringify({ continentCode: continentCode || undefined }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
