# Updater security

The in-panel updater accepts only a stable exact semantic tag backed by a non-draft, non-prerelease GitHub Release. `main`, arbitrary refs, malformed versions, downgrades, and concurrent duplicate requests are rejected. A literal `dev` build may bootstrap once to a verified stable release.

Trigger authorization is installation-global (`users.is_system_admin`), not organization RBAC. State is persisted in PostgreSQL so a backend restart does not erase progress.

The backend has neither a generic host-command API nor a production Docker socket. A dedicated privileged helper owns the narrow fixed `install.sh --update --version <verified-tag>` capability and the typed installation public-access operation. Before replacement it verifies release/tag identity, existing configuration, PostgreSQL data path, source cleanliness, Compose configuration, and image preparation.

The updater preserves `silicon.env`, encryption key, database password, HTTP port, public URL, persistent directories, and PostgreSQL. It never invokes `down -v`, prunes Silicon volumes, resets the schema, or regenerates credentials. Normal forward migrations run against the existing database.

Operators must still take tested backups and protect the host/Docker trust boundary before an upgrade.

For installation public access, the same helper may atomically change only `SILICON_PUBLIC_URL`, `SILICON_COOKIE_SECURE`, `SILICON_TRUST_FORWARDED_PROTO`, and `SILICON_BIND_ADDRESS`, then recreate only the backend/frontend services. The previous values are persisted before mutation and restored after a failed Compose validation, restart, or health check. `SILICON_HTTP_PORT`, database credentials, encryption material, PostgreSQL, and unrelated environment values remain unchanged. See [Expose Silicon on a custom domain](../guides/public-access.md).
