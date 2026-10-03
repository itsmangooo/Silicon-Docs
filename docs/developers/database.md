# Database and store

PostgreSQL is the authoritative store. Silicon uses pgx and explicit SQL rather than a heavy ORM.

`backend/internal/store/store.go` opens a bounded pool. `repository.go` and feature files such as `networks.go`, `integrations.go`, `runtime.go`, and `aws.go` implement queries and transactions.

Organization-owned resources are always scoped in SQL. Nested resources use organization-qualified foreign keys where practical, so a user who belongs to two organizations still cannot connect an Org A application to an Org B server or integration.

Use:

- foreign keys for ownership/lifecycle;
- tenant-scoped uniqueness constraints;
- checks for state vocabularies and valid ranges;
- indexes matching scoped lookups and worker claims;
- transactions for state plus audit/job changes;
- validated JSON only for genuinely provider-specific configuration.

Users, sessions, and account-authentication state are intentionally global. Membership maps a global user to an organization and role.

Never reset a development or production database from application code. Destructive integration tests refuse any database whose name is not exactly `silicon_test`.
