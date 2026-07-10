---
description: "Shared safe-output job for sending a Slack DM to the configured docs notifier"
safe-outputs:
  jobs:
    slack-dm-notify:
      description: "Send a direct message to the configured Slack recipient"
      runs-on: ubuntu-latest
      output: "Slack DM sent"
      timeout-minutes: 10
      permissions:
        contents: read
      inputs:
        message:
          description: "The message text to send in the Slack direct message"
          required: true
          type: string
      steps:
        - name: Send Slack DM
          uses: actions/github-script@v8
          env:
            SLACK_BOT_TOKEN: "${{ secrets.SLACK_BOT_TOKEN }}"
            SLACK_NOTIFY_EMAIL: "${{ vars.SLACK_NOTIFY_EMAIL }}"
          with:
            script: |
              const fs = require("fs");

              const token = process.env.SLACK_BOT_TOKEN;
              const email = process.env.SLACK_NOTIFY_EMAIL;
              const outputFile = process.env.GH_AW_AGENT_OUTPUT;
              const staged = process.env.GH_AW_SAFE_OUTPUTS_STAGED === "true";

              if (!token) {
                core.setFailed("SLACK_BOT_TOKEN secret is not configured");
                return;
              }

              if (!email) {
                core.setFailed("SLACK_NOTIFY_EMAIL repo variable is not configured");
                return;
              }

              if (!outputFile || !fs.existsSync(outputFile)) {
                core.setFailed("GH_AW_AGENT_OUTPUT is missing or unreadable");
                return;
              }

              const payload = JSON.parse(fs.readFileSync(outputFile, "utf8"));
              const items = (payload.items || []).filter(
                (item) => item.type === "slack_dm_notify"
              );
              const messages = items
                .map((item) => item.message)
                .filter((message) => typeof message === "string" && message.trim().length > 0);

              if (messages.length === 0) {
                core.info("No Slack DM messages found; skipping send.");
                return;
              }

              if (staged) {
                core.info("Staged mode: would send Slack DM");
                await core.summary
                  .addHeading("Staged Mode: Slack DM Preview", 2)
                  .addRaw(`**Recipient:** ${email}\n\n`)
                  .addCodeBlock(messages.join("\n\n---\n\n"), "text")
                  .write();
                return;
              }

              const slackFormRequest = async (method, params) => {
                const response = await fetch(`https://slack.com/api/${method}`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: new URLSearchParams(params),
                });

                const data = await response.json();

                if (!response.ok || !data.ok) {
                  const detail = data.error ? `${data.error}` : `HTTP ${response.status}`;
                  throw new Error(`${method} failed: ${detail}`);
                }

                return data;
              };

              try {
                const userLookup = await slackFormRequest("users.lookupByEmail", { email });
                const userId = userLookup.user && userLookup.user.id;

                if (!userId) {
                  core.setFailed(`Slack user lookup returned no user ID for ${email}`);
                  return;
                }

                const openConversation = await slackFormRequest("conversations.open", {
                  users: userId,
                });
                const channelId = openConversation.channel && openConversation.channel.id;

                if (!channelId) {
                  core.setFailed(`Could not open a Slack DM conversation for ${email}`);
                  return;
                }

                for (const message of messages) {
                  await slackFormRequest("chat.postMessage", {
                    channel: channelId,
                    text: message,
                  });
                }

                core.info(`Sent ${messages.length} Slack DM message(s) to ${email}`);
              } catch (error) {
                core.setFailed(`Failed to send Slack DM: ${error.message}`);
              }
---
