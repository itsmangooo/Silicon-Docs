---
title: System email and password recovery
---

# System email and password recovery security

System email is installation-global. Authorization checks `users.is_system_admin` and remains independent from organization membership roles.

Provider credentials and queued message bodies are encrypted with AES-256-GCM using distinct authenticated contexts. API reads expose configuration and health, never credential ciphertext or plaintext. Sanitized failure text excludes response bodies and credentials.

Password-reset requests are non-enumerating and database-rate-limited. Tokens use 256 bits of cryptographic randomness; PostgreSQL stores only SHA-256 hashes. Each token is time-limited and single-use, and a new request supersedes older valid tokens. The raw token exists only in transient application memory and the encrypted queue body required to send it.

Reset completion locks the token row and updates the password, consumes all remaining reset tokens, revokes all sessions, and appends a safe audit event in one database transaction. The host CLI uses the same password policy and revocation behavior while remaining interactive and unavailable over HTTP.

SMTP defaults to authenticated TLS with certificate and hostname verification. Silicon refuses authentication when encryption is `none`. Provider-specific presets never bypass the shared SMTP security behavior.

See the [operator procedure](../guides/system-email.md) and the source implementation under `backend/internal/mailservice`, `backend/internal/providers/mail`, `backend/internal/httpapi/mail.go`, and `backend/internal/store/mail.go`.
