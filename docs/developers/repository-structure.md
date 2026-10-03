# Repository structure

```text
Silicon/
├── backend/
│   ├── cmd/silicon/             platform composition root
│   ├── cmd/silicon-updater/     narrowly scoped update runner
│   ├── db/migrations/           embedded forward SQL migrations
│   ├── internal/                domain, store, jobs, and providers
│   └── openapi/openapi.yaml     REST contract
├── frontend/
│   ├── public/                  static panel assets
│   ├── scripts/                 preview capture tooling
│   └── src/                     React/Vite JavaScript application
├── deploy/                      images, PostgreSQL init, installer tests
├── docs/                        in-panel operator Markdown and ADRs
├── services/                    reserved; no Silicon Agent exists
├── docker-compose.yml           local development stack
├── docker-compose.production.yml
├── install.sh
└── Makefile
```

The Git repository root is `Silicon/`. The Go module starts at `backend/`; the npm project starts at `frontend/`. They have independent dependency graphs. Production image assembly is defined under `deploy/` and in the production Compose file.

`docs/guide/` is compiled into the authenticated panel by explicit imports in `frontend/src/docs/registry.js`. This public documentation project is separate and does not participate in that build.
