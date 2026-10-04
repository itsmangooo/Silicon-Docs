# Providers

Provider contracts isolate infrastructure-specific behavior from the core model:

| Contract | Path | Current adapters |
| --- | --- | --- |
| Runtime | `internal/providers/runtime` | local/remote Docker dispatcher |
| Connection | `internal/providers/connection` | local, SSH, AWS SSM |
| Git | `internal/providers/git` | GitHub App |
| DNS/Tunnel | `internal/providers/dns`, `tunnel` | Cloudflare |
| Cloud | `internal/providers/cloud/aws` | AWS SDK v2 |
| Network | `internal/providers/network` | WireGuard/CoreDNS/nftables |
| Secrets | `internal/providers/secrets` | local AES-GCM |
| Routing | `internal/providers/routing` | external/operator-managed |
| Identity | `internal/providers/identity` | contract only; OIDC login not enabled |
| Mail | `internal/providers/mail` | Resend, Postmark, Mailgun, Amazon SES, generic SMTP with self-hosted presets |

Mail adapters implement `Send`, `Test`, and `Capabilities`. Provider selection and validated normalized settings live in `internal/mailservice`; password recovery depends on the shared contract and durable queue rather than any vendor API. SMTP presets for BillionMail, Stalwart, mailcow, and Postal remain configuration helpers for the same adapter.

## Mail provider internals

The source paths below are relative to `backend/` in the Silicon repository:

- `internal/providers/mail/mail.go` contains only normalized messages, capability flags, validation, and the provider interface.
- `internal/providers/mail/{resend,postmark,mailgun,ses,smtp}` contain transport-specific authentication and request/SMTP encoding.
- `internal/mailservice/config.go` validates the installation configuration and is the only provider-construction switch.
- `internal/mailservice/templates.go` produces plain-text and HTML transactional messages.
- `internal/mailservice/worker.go` claims persisted deliveries, opens the encrypted credential/message envelopes for one attempt, applies bounded retry delays, and stores only sanitized failures.
- `internal/store/mail.go` owns the global configuration, durable queue, database rate limit, token superseding, and transactional password/session mutation.
- `internal/httpapi/mail.go` contains the installation-admin endpoints and the public anti-enumeration reset flow.
- `db/migrations/000012_system_mail.up.sql` adds the global configuration, delivery queue, hashed request characteristics, and reset-token lifecycle fields.

Queued message bodies are encrypted because a recovery URL must survive a worker or backend restart. The searchable delivery columns contain only operational fields such as purpose, recipient, status, attempt count, and a sanitized error; raw recovery tokens are not stored in token columns, metadata, logs, or audit records. Provider credentials use a different authenticated encryption context from queued messages.

Reset completion selects the active hashed token with a row lock. Password update, consumption of all outstanding tokens, deletion of every user session, and the audit insert commit in one PostgreSQL transaction. Request throttling is also stored in PostgreSQL, so restarting or horizontally replacing the backend does not reset limits.

### Add another mail provider

1. Add an adapter package under `internal/providers/mail/<provider>` and implement the shared interface without exporting vendor response types.
2. Bound network calls with context timeouts and translate vendor failures into credential-safe errors. Mark permanent recipient/provider rejection with `mail.ErrRejected` so the queue does not retry forever.
3. Add only non-secret validated settings to `mailservice.Settings`. Add every credential field to `mailservice.Credentials`, which is serialized only into the encrypted credential envelope.
4. Extend `mailservice.Validate` and the factory in `mailservice.Provider`. Do not add provider branches to password recovery or templates.
5. Add the system-admin input fields and write-only OpenAPI properties. Normal reads must return only `credentialConfigured`.
6. Add mocked request-generation, timeout, safe-error, encrypted-storage, queue, and UI tests. CI must not require a real provider account.
7. Update the operator guide with sender-verification and least-privilege instructions.

## Add a provider

1. Extend or create the smallest provider-independent contract.
2. Keep SDK/API types inside the adapter package.
3. Normalize desired state and results for core callers.
4. Add construction/selection only at the composition boundary.
5. Make destructive actions ownership-aware and idempotent.
6. Add mock-provider unit tests, tenant-isolation tests, redaction tests, and at least one real integration test where practical.
7. Document unsupported operations instead of returning fake success.

Never add an unrestricted shell/command endpoint to satisfy a provider requirement.
