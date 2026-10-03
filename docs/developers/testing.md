# Testing

Run the supported root checks:

```sh
make test
make lint
make build
make compose-config
```

Run the database suite serially against the explicitly disposable database:

```sh
docker compose up -d postgres
cd backend
TEST_DATABASE_URL='postgres://silicon:silicon-development-only@localhost:5432/silicon_test?sslmode=disable' \
  go test -count=1 -p=1 ./...
```

Useful focused commands:

```sh
cd backend
go test -race ./internal/jobs ./internal/providers/network/wireguard ./internal/store ./internal/httpapi
go vet ./...
test -z "$(gofmt -l .)"

cd ../frontend
npm ci
npm run lint
npm test
npm run build
```

CI also runs a real Docker runtime lifecycle, ShellCheck, installer collision/preservation tests, production Compose validation, a clean production install, and repeat installation. Database tests must include two organizations and representative cross-tenant failures. Provider tests use mock HTTP/SDK endpoints unless a guarded integration test explicitly enables a real local facility.
