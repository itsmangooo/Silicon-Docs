# Contributing

Keep changes focused, real, tested, and documented.

1. Start from current `main` and inspect the worktree before editing.
2. Preserve unrelated local work and existing public/API/data contracts.
3. Keep the backend a modular monolith; add a process only for a real topology or privilege boundary.
4. Put provider-specific behavior behind a focused interface.
5. Scope all tenant-owned relationships and queries by organization.
6. Use forward, data-preserving migrations.
7. Add tests in the package that owns the behavior plus API/database integration coverage where applicable.
8. Update OpenAPI and the in-panel operator docs when behavior changes.
9. Run formatting, tests, lint, builds, Compose, and relevant security checks.
10. Never commit credentials or sanitized-looking values derived from real accounts.

For a new reconciliation worker, add the durable state/job model in migrations/store, implement an idempotent runner under `internal/jobs`, compose it in `cmd/silicon`, expose only typed actions, and test retries, concurrent claims, terminal failure, audit, and organization isolation.

Report known limitations honestly; do not document planned AWS/Azure/Kubernetes/provider behavior as implemented.
