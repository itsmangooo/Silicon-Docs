# REST API and OpenAPI

The versioned API is rooted at `/api/v1`. The maintained contract is `backend/openapi/openapi.yaml`; handlers are registered in `backend/internal/httpapi/api.go`.

Authentication uses an opaque HTTP-only session cookie and a separate CSRF token for unsafe requests. Organization routes include `{organizationID}` and pass through membership plus named-permission middleware. IDs alone never establish access.

## Using the API

1. Choose an exact Silicon release and check that release's OpenAPI file. Use the installation URL you already sign in to, with `/api/v1` appended.
2. Use `POST /auth/login` over HTTPS with an authorized local account. Keep the returned cookies in your HTTP client's protected session storage. The JSON response includes the CSRF token. Send it as `X-CSRF-Token` on unsafe requests and keep the browser or client's origin aligned with the installation's public URL.
3. Read `GET /organizations` and select the intended organization. Use its ID with resource routes such as `GET /organizations/{organizationID}/applications`. Start with read-only calls to verify account permissions and scope.
4. Handle `401` by signing in again, `403` by checking role and CSRF rules, and `422` by validating the request fields. Log status codes and request details without storing passwords, sessions, tokens, or secrets.

Silicon has no published client SDK or standalone API-token workflow. You can generate a client from the published OpenAPI contract and supply the session and CSRF handling. The AWS SDK for Go v2 is an internal AWS provider dependency. External proxies use the [operator-managed routing flow](../guides/external-proxy.md).

When changing the API:

1. use resource-oriented HTTP semantics and existing response/error shapes;
2. cap input, reject unknown JSON fields, and validate every relationship in organization scope;
3. update the OpenAPI path, schemas, examples, and status codes in the same change;
4. add handler tests for success, validation, permission denial, and another organization's ID;
5. run `go test -count=1 -p=1 ./...` so OpenAPI validation and database flows execute.

Do not expose provider credentials, decrypted secrets, session tokens, generic remote commands, or raw SDK error bodies.

[Browse the current OpenAPI source](https://github.com/itsmangooo/Silicon/blob/main/backend/openapi/openapi.yaml).
