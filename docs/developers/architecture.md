# Architecture

Silicon is a modular monolith: one Go process owns HTTP delivery, authorization, orchestration, provider composition, asynchronous workers, and PostgreSQL persistence. React consumes a versioned REST API. Independent processes exist only for a justified privilege boundary, such as the host-side updater.

```mermaid
flowchart LR
  Browser[React/Vite panel] -->|REST + session + CSRF| API[internal/httpapi]
  API --> Policy[internal/authorization]
  API --> Store[internal/store]
  Store --> DB[(PostgreSQL)]
  API --> Audit[Audit writer]
  API --> Mail[MailProvider]
  Mail --> MailQueue[(Encrypted mail queue)]
  MailQueue --> Store
  Jobs[internal/jobs] --> Store
  Jobs --> Runtime[RuntimeProvider]
  Jobs --> AWS[AWS provider]
  Jobs --> Network[NetworkProvider]
  Runtime --> Connection[ServerConnectionProvider]
  Connection --> Local[Local]
  Connection --> SSH[SSH]
  Connection --> SSM[AWS SSM]
  Network --> WireGuard[WireGuard/CoreDNS/nftables]
```

`backend/cmd/silicon/main.go` is the composition boundary. It loads configuration, opens pgx, runs migrations, constructs concrete adapters, and starts deployment, AWS, network, and system-mail workers plus the HTTP server.

`backend/internal/providers/mail` defines the provider-neutral send/test/capability contract. Concrete Resend, Postmark, Mailgun, Amazon SES, and SMTP adapters stay behind it. `backend/internal/mailservice` owns normalized provider configuration, recovery templates, encryption boundaries, and retry processing; `backend/internal/store/mail.go` owns durable queue, rate-limit, and transactional reset persistence.

Business code depends on contracts in `backend/internal/providers/*`; concrete cloud/runtime implementation details remain in adapters. Provider selection belongs at composition/dispatch boundaries rather than scattered `if provider == ...` branches.

Organizations are tenant boundaries. Handlers authorize named permissions, repository queries include organization scope, and composite foreign keys reinforce same-tenant parent/child relationships. Safe audit events are written alongside meaningful changes.

See [Backend](backend.md), [Providers](providers.md), and [Networking internals](networking-internals.md).
