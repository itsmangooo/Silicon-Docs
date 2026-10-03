# Source setup

## Requirements

Silicon's checked-in toolchain currently targets:

- Go 1.26 (declared by `backend/go.mod`);
- Node.js 24 and npm 11 for the panel CI/build;
- PostgreSQL 17;
- Docker Engine with Docker Compose v2.

Clone and initialize the development environment:

```sh
git clone https://github.com/itsmangooo/Silicon.git
cd Silicon
cp .env.example .env
docker compose up -d postgres
```

Load the `.env` values into the two development shells. Never commit real secrets. `SILICON_ENCRYPTION_KEY` must be a base64-encoded 32-byte key when exercising encrypted providers; local Docker stays disabled unless `SILICON_LOCAL_DOCKER_ENABLED=true` is an intentional choice.

Run the backend:

```sh
cd backend
go run ./cmd/silicon
```

Run the frontend separately:

```sh
cd frontend
npm install
npm run dev
```

The Vite server opens on `http://localhost:5173` and proxies `/api` to the Go service on port 8080. To build the complete development Compose profile instead, run `docker compose --profile platform up --build` from the repository root.

Continue with [Testing](testing.md) and [Repository structure](repository-structure.md).
