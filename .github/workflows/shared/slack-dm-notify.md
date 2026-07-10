---
description: "Shared safe-output job for posting the docs check summary to Slack"
safe-outputs:
  jobs:
    slack-channel-notify:
      description: "Post the summary message to the configured Slack channel"
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
            SLACK_BOT_TOKEN: "${{ secrets.SLACK_BOT_TOKEN }}"
            SLACK_NOTIFY_CHANNEL: "${{ vars.SLACK_NOTIFY_CHANNEL }}"
          with:
            script: |
              const fs = require("fs");

              const token = process.env.SLACK_BOT_TOKEN;
              const configuredChannel = process.env.SLACK_NOTIFY_CHANNEL || "lf-team-engineering";
              const outputFile = process.env.GH_AW_AGENT_OUTPUT;
              const staged = process.env.GH_AW_SAFE_OUTPUTS_STAGED === "true";
              const footer = "Feedback on quality of outputs? Share with Annabell\n#lf-team-engineering";

              if (!token) {
                core.setFailed("SLACK_BOT_TOKEN secret is not configured");
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
                  .addRaw(`**Channel:** ${configuredChannel}\n\n`)
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

              const resolveChannelId = async () => {
                if (/^[CDG][A-Z0-9]+$/.test(configuredChannel)) {
                  return configuredChannel;
                }

                const normalizedChannel = configuredChannel.replace(/^#/, "");
                let cursor = undefined;

                do {
                  const params = {
                    exclude_archived: "true",
                    limit: "200",
                    types: "public_channel,private_channel",
                  };

                  if (cursor) {
                    params.cursor = cursor;
                  }

                  const response = await slackFormRequest("conversations.list", params);
                  const match = (response.channels || []).find(
                    (channel) => channel.name === normalizedChannel
                  );

                  if (match && match.id) {
                    return match.id;
                  }

                  cursor = response.response_metadata && response.response_metadata.next_cursor;
                } while (cursor);

                throw new Error(
                  `Could not resolve Slack channel '${configuredChannel}'. Set SLACK_NOTIFY_CHANNEL to a channel ID or grant the bot read access to channels.`
                );
              };

              try {
                const channelId = await resolveChannelId();

                for (const message of messages) {
                  const finalMessage = message.trim().endsWith(footer)
                    ? message.trim()
                    : `${message.trim()}\n\n${footer}`;
                  await slackFormRequest("chat.postMessage", {
                    channel: channelId,
                    text: finalMessage,
                  });
                }

                core.info(`Sent ${messages.length} Slack message(s) to ${configuredChannel}`);
              } catch (error) {
                core.setFailed(`Failed to send Slack message: ${error.message}`);
              }
---
