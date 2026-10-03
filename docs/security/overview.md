# Security overview

Silicon treats organization boundaries, credentials, and infrastructure operations as security boundaries.

## Authentication

Passwords use Argon2id with random salts. Browser sessions use random opaque tokens; only token hashes are stored. Cookies are HTTP-only, `SameSite=Strict`, and should be Secure behind production HTTPS. Unsafe requests require a separately hashed CSRF token. Login replaces the previous cookie to prevent fixation.

## Authorization and tenancy

Owner, Admin, Developer, and Viewer map to named permissions. Organization handlers load membership and authorize the required permission; repository queries and database constraints preserve the same organization. Missing membership returns a non-enumerating response.

## Inputs, output, and audit

JSON bodies are bounded and reject unknown fields. Workload logs are untrusted text. Provider errors are normalized. Structured request logs carry a request ID without credentials. Audit events record actor, organization, action, resource, request ID, timestamp, and safe metadata.

Never log passwords, session/CSRF tokens, GitHub keys/tokens, Cloudflare tokens, AWS credentials/External IDs, SSH keys, encryption keys, or application secrets.

Report suspected vulnerabilities privately to the repository owner rather than a public issue.
