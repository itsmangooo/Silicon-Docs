# Backend

The backend is a Go modular monolith rooted at `backend/`.

## Request path

`internal/httpapi/api.go` registers Go 1.22-style method/path patterns. Middleware adds recovery, security headers, CORS, request IDs, structured logs, authentication, CSRF checks, organization membership, and permission evaluation. Feature files such as `networks.go`, `servers.go`, `integrations.go`, and `aws.go` own transport validation and response mapping.

`internal/store` contains explicit pgx SQL and transactions. It returns core records rather than provider SDK objects. Domain packages such as `auth`, `authorization`, `deployments`, `budgets`, and `updates` own focused rules.

## Add an endpoint

1. Define the resource semantics and named permission in `internal/authorization` when needed.
2. Add a tenant-scoped repository method in `internal/store`.
3. Add the handler in the relevant `internal/httpapi/*.go` file.
4. Register it in `API.Handler()` with authentication and permission middleware.
5. Update `backend/openapi/openapi.yaml`.
6. Add handler and two-organization integration tests.
7. Add the frontend client/page only after the API contract is real.

Keep errors safe, cap request bodies, reject unknown JSON fields, and never log credential-bearing input.
