# REST API and OpenAPI

The versioned API is rooted at `/api/v1`. The maintained contract is `backend/openapi/openapi.yaml`; handlers are registered in `backend/internal/httpapi/api.go`.

Authentication uses an opaque HTTP-only session cookie and a separate CSRF token for unsafe requests. Organization routes include `{organizationID}` and pass through membership plus named-permission middleware. IDs alone never establish access.

When changing the API:

1. use resource-oriented HTTP semantics and existing response/error shapes;
2. cap input, reject unknown JSON fields, and validate every relationship in organization scope;
3. update the OpenAPI path, schemas, examples, and status codes in the same change;
4. add handler tests for success, validation, permission denial, and another organization's ID;
5. run `go test -count=1 -p=1 ./...` so OpenAPI validation and database flows execute.

Do not expose provider credentials, decrypted secrets, session tokens, generic remote commands, or raw SDK error bodies.

[Browse the current OpenAPI source](https://github.com/itsmangooo/Silicon/blob/main/backend/openapi/openapi.yaml).
