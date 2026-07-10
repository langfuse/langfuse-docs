---
description: "Shared safe-output job for posting the docs check summary to Slack via incoming webhook"
safe-outputs:
  jobs:
    slack-channel-notify:
      description: "Post the summary message to the configured Slack webhook"
      runs-on: ubuntu-latest
      output: "Slack message sent"
      timeout-minutes: 10
      permissions:
        contents: read
      inputs:
        message:
          description: "The message text to send in Slack"
          required: true
          type: string
      steps:
        - name: Send Slack message
          uses: actions/github-script@v8
          env:
            SLACK_WEBHOOK_URL: "${{ secrets.SLACK_WEBHOOK_URL }}"
          with:
            script: |
              const fs = require("fs");

              const webhookUrl = process.env.SLACK_WEBHOOK_URL;
              const outputFile = process.env.GH_AW_AGENT_OUTPUT;
              const staged = process.env.GH_AW_SAFE_OUTPUTS_STAGED === "true";
              const footer = "Feedback on quality of outputs? Share with Annabell\n#lf-team-engineering";

              if (!webhookUrl) {
                core.setFailed("SLACK_WEBHOOK_URL secret is not configured");
                return;
              }

              if (!outputFile || !fs.existsSync(outputFile)) {
                core.setFailed("GH_AW_AGENT_OUTPUT is missing or unreadable");
                return;
              }

              const payload = JSON.parse(fs.readFileSync(outputFile, "utf8"));
              const items = (payload.items || []).filter(
                (item) => item.type === "slack_channel_notify"
              );
              const messages = items
                .map((item) => item.message)
                .filter((message) => typeof message === "string" && message.trim().length > 0);

              if (messages.length === 0) {
                core.info("No Slack channel messages found; skipping send.");
                return;
              }

              if (staged) {
                core.info("Staged mode: would send Slack channel message");
                await core.summary
                  .addHeading("Staged Mode: Slack Channel Preview", 2)
                  .addRaw("**Destination:** Configured Slack incoming webhook\n\n")
                  .addCodeBlock(
                    messages
                      .map((message) =>
                        message.trim().endsWith(footer) ? message.trim() : `${message.trim()}\n\n${footer}`
                      )
                      .join("\n\n---\n\n"),
                    "text"
                  )
                  .write();
                return;
              }

              const sendWebhookMessage = async (text) => {
                const response = await fetch(webhookUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ text }),
                });
                const body = await response.text();

                if (!response.ok) {
                  const detail = body.trim() || `HTTP ${response.status}`;
                  throw new Error(`Incoming webhook request failed: ${detail}`);
                }

                if (body.trim() !== "ok") {
                  throw new Error(`Incoming webhook returned unexpected response: ${body.trim()}`);
                }
              };

              try {
                for (const message of messages) {
                  const finalMessage = message.trim().endsWith(footer)
                    ? message.trim()
                    : `${message.trim()}\n\n${footer}`;
                  await sendWebhookMessage(finalMessage);
                }

                core.info(`Sent ${messages.length} Slack message(s) via incoming webhook`);
              } catch (error) {
                core.setFailed(`Failed to send Slack message: ${error.message}`);
              }
---
