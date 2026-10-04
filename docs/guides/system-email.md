---
title: System email and password recovery
description: Configure a mail provider, verify delivery, recover an account, and use emergency host recovery.
---

# System email and password recovery

Silicon uses one installation-wide mail configuration for account recovery and future system notices. Only an installation administrator can read or change it; organization Owner or Admin roles are not sufficient by themselves.

## Before you start

Confirm the installation has a persistent `SILICON_ENCRYPTION_KEY` and that `SILICON_PUBLIC_URL` is the address users can open. Recovery links are built from that canonical URL. Do not change the encryption key after storing credentials.

Prepare one provider:

| Provider | Required values |
|---|---|
| Resend | Verified sender and API key |
| Postmark | Verified sender and server token |
| Mailgun | Verified sender, sending domain, and API key |
| Amazon SES | Verified sender, region, access-key ID, and secret access key; optional session token |
| SMTP | Host, port, TLS mode, and username/password when the relay requires authentication |

Use a narrowly scoped sending credential where the provider supports it. Amazon SES identities must be verified and sandbox accounts can send only to verified recipients.

## Configure the provider

1. Sign in with the installation administrator account.
2. Open **Settings → Email**.
3. Select the provider.
4. Enter **From name**, **From address**, and the optional **Reply-to address**.
5. Enter provider-specific settings and the write-only credential.
6. Select **Save email configuration**.
7. Under **Delivery test**, enter a recipient you control.
8. Select **Send test email**.
9. Refresh or wait briefly for **Health** to show `healthy`.

![System email configuration with sanitized SMTP values](/img/screenshots/settings-email.png)

Credentials are AES-256-GCM encrypted and never returned by the API. Leaving the credential empty while editing the same provider keeps the stored value; changing provider requires a new credential.

### Self-hosted SMTP presets

BillionMail, Stalwart, mailcow, and Postal appear as SMTP presets. They prefill normal SMTP transport defaults and do not introduce product-specific dependencies. Verify the actual host, port, credentials, and TLS mode from your mail server.

Prefer STARTTLS on port 587 or implicit TLS on port 465. Silicon enforces certificate and hostname checks and refuses authenticated SMTP without encryption. The `none` transport is intended only for a trusted local relay that does not require authentication.

## Recover a password

1. On the sign-in page, select **Forgot password?**.
2. Enter the account email.
3. Select **Send reset link**.

![Password recovery request](/img/screenshots/forgot-password.png)

The response is intentionally identical for known and unknown accounts. Silicon rate limits requests using non-reversible email/IP characteristics, generates a 256-bit random token, stores only its SHA-256 hash, and places the encrypted message in the durable delivery queue.

4. Open the delivered link within 30 minutes.
5. Enter and confirm a new password of 12–1024 characters.
6. Sign in again.

![Choose a new password from a single-use recovery link](/img/screenshots/reset-password.png)

A newer request supersedes older links. Successful use invalidates every outstanding link and every existing browser session for the account.

## Emergency recovery without email

An operator with interactive access to the Silicon host can run:

```bash
docker exec -it silicon-backend /silicon admin reset-password admin@example.com
```

The command prints the exact account, requires typing `RESET`, reads the new password without echoing it, applies Argon2id, revokes all sessions/reset links, and writes a safe audit event. It is not exposed as an HTTP endpoint.

## Delivery and retries

Silicon persists the encrypted message before responding. The worker claims jobs with database locking, retries transient failures with bounded backoff, and resumes after a backend restart. A permanent provider rejection or exhausted retry limit marks the delivery failed. Provider response bodies, credentials, and recovery tokens are never logged.

## Troubleshooting

### Health remains `not_tested`

Queue a test message and check the backend is running the mail worker. Confirm migration `000012_system_mail` has been applied.

### SMTP authentication failed

Re-enter the write-only password, confirm the username, and verify STARTTLS or implicit TLS is selected. Check that the configured host matches the certificate.

### Provider accepted the test but no message arrived

Check sender/domain verification, sandbox restrictions, suppression/bounce lists, and spam filtering. Provider dashboards may provide delivery detail that Silicon intentionally does not copy into logs.

### Recovery link is invalid

Request a new link. Links expire after 30 minutes, are single-use, and are superseded when another link is requested.

### Link points to the wrong host

Correct `SILICON_PUBLIC_URL` or configure [installation public access](public-access.md), restart the required Silicon services, then request a new link. Existing messages do not change after delivery.
