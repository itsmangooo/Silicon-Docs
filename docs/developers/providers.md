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

## Add a provider

1. Extend or create the smallest provider-independent contract.
2. Keep SDK/API types inside the adapter package.
3. Normalize desired state and results for core callers.
4. Add construction/selection only at the composition boundary.
5. Make destructive actions ownership-aware and idempotent.
6. Add mock-provider unit tests, tenant-isolation tests, redaction tests, and at least one real integration test where practical.
7. Document unsupported operations instead of returning fake success.

Never add an unrestricted shell/command endpoint to satisfy a provider requirement.
