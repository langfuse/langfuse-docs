import { POST } from "../../components/qaChatbot/apiHandler";
export { maxDuration } from "../../components/qaChatbot/apiHandler";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  return POST(req);
}
