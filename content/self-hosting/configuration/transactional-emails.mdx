---
title: Transactional Emails (self-hosted)
description: Learn how to configure transactional emails for your self-hosted Langfuse deployment.
label: "Version: v3"
sidebarTitle: "Transactional Emails"
---

# Transactional Email

Optionally, you can configure an SMTP server to send transactional emails.
These are used for password resets, project/organization invitations, and notifications when a batch export is completed.

## Configuration

To enable transactional emails, set the following environment variables on the application containers:

| Variable              | Description                                                                                                                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SMTP_CONNECTION_URL` | Connection URL for transactional email. Accepts a standard SMTP URL (`smtp://` or `smtps://`) that is passed to Nodemailer ([docs](https://nodemailer.com/smtp)), or `ses://<region>` (e.g. `ses://us-east-1`) to send via [AWS SES](#aws-ses) using the default AWS credential chain (IAM role, SSO, env vars). |
| `EMAIL_FROM_ADDRESS`  | Configure from address for transactional email. Required if `SMTP_CONNECTION_URL` is set.                                                                                                                                                                                                                        |

## AWS SES [#aws-ses]

When `SMTP_CONNECTION_URL` is set to `ses://<region>`, Langfuse sends transactional emails through [AWS SES](https://aws.amazon.com/ses/) using the SESv2 API.
No additional configuration variables are required — credentials are resolved through the [default AWS credential chain](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html) (IAM role, IRSA, ECS task role, SSO, `AWS_PROFILE`, or environment variables), which mirrors the credential handling used for [S3 blob storage](/self-hosting/deployment/infrastructure/blobstorage).

If Langfuse is running on AWS, we recommend attaching an IAM role to the Langfuse container with permission to send via SES:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["ses:SendEmail"],
      "Effect": "Allow",
      "Resource": "*",
      "Sid": "LangfuseSendEmail"
    }
  ]
}
```

Make sure the `EMAIL_FROM_ADDRESS` is a [verified identity](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html) in the same region, and that your account is out of the SES sandbox if you need to send to arbitrary recipients.

Example configuration:

```yaml
SMTP_CONNECTION_URL=ses://us-east-1
EMAIL_FROM_ADDRESS=no-reply@example.com
```

## FAQ

- **Which SMTP service to use?** It is recommended to use a reputable SMTP service for transactional emails to ensure delivery and prevent abuse. If you do not have a preferred service from your cloud provider, try [Resend](https://resend.com/) or [Postmark](https://postmarkapp.com/). Both are easy to set up and have generous free tiers.
- **Can I use my private inbox?** No, private inboxes (like GMail) are generally not recommended and difficult to configure correctly.
