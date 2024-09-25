import Langfuse from "langfuse";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const l = new Langfuse({
    publicKey: "pk-lf-1234567890",
    secretKey: "sk-lf-1234567890",
    baseUrl: "https://staging.langfuse.com",
  });

  const p = await l.getDataset("help");
  console.log(p);
  return res.status(200).json(p);
}
