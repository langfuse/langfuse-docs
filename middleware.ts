import { type NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { get } from "@vercel/edge-config";

export async function middleware(req: NextRequest) {
  const ip = getIP(req);
  const config = await get("blockedIps");
  const blockedIps = Array.isArray(config) ? config : [config];

  if (blockedIps.includes(ip)) {
    console.log("Blocked request by ip: ", ip);
    return new Response("Access denied", { status: 403 });
  }

  return;
}

export default function getIP(request: Request | NextApiRequest) {
  const xff =
    request instanceof Request
      ? request.headers.get("x-forwarded-for")
      : request.headers["x-forwarded-for"];

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(",")[0]) : "127.0.0.1";
}
