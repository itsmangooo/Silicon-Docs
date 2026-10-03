# Migrations

Forward migrations live in `backend/db/migrations/` and use zero-padded names such as `000010_private_networking.up.sql`. They are embedded by `backend/db/migrate.go` and applied in lexical order at backend startup when `SILICON_AUTO_MIGRATE=true`.

Each unapplied file runs inside one PostgreSQL transaction. A successful commit records the filename version in `schema_migrations`. A failure rolls back the migration and prevents the backend from starting.

## Add a migration

1. Inspect all existing migrations and current production data assumptions.
2. Add the next numbered `.up.sql` file; never rewrite an applied migration.
3. Prefer additive, data-preserving changes and explicit backfills before new `NOT NULL` constraints.
4. Scope foreign keys and uniqueness by organization when the data is tenant-owned.
5. Preserve applications, servers, deployments, integrations, secrets, and audit history.
6. Extend fresh-database and upgrade-path integration coverage.
7. Run the suite against a disposable `silicon_test` PostgreSQL 17 database.

The historical `000004_agent.up.sql` is followed by `000005_ssh_connections.up.sql`, which removes the retired Agent schema while preserving server records. It remains in history so existing installations can migrate forward safely.
