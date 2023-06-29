import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [slackResponse, loopsResponse] = await Promise.all([
      fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({ rawMessage: JSON.stringify(req.body, null, 2) }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch("https://app.loops.so/api/v1/contacts/create", {
        method: "POST",
        body: JSON.stringify({
          email: req.body.email,
          source: req.body.source,
          receiveProductUpdates: true,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      }),
    ]);

    if (slackResponse.status === 200 && loopsResponse.status === 200) {
      res.status(200).json({ status: "OK" });
    } else {
      console.error(slackResponse);
      console.error(loopsResponse);
      res.status(400).json({ status: "Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "Error" });
  }
}
