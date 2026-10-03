# Secrets and encryption

Silicon separates readable environment variables from encrypted secrets. The local provider uses AES-256-GCM with organization, scope, and secret name included as authenticated context.

`SILICON_ENCRYPTION_KEY` must be a base64-encoded 32-byte value supplied by the installation. It protects application secrets and provider credentials. Back it up securely with `silicon.env`; losing it makes encrypted values unrecoverable. Never regenerate it during an update or ordinary configuration change.

Secret create/update accepts plaintext only for the bounded operation. Normal reads return metadata, not values. Values do not appear in `.env` previews, search, audit metadata, deployment events, or structured logs.

Scopes resolve as application over environment over project. Tenant-qualified foreign keys prevent inheritance across organizations. Docker host administrators remain trusted because they can inspect a container's environment at runtime.

Automated key rotation is not currently implemented. Plan rotation as an explicit backup, re-encryption, verification, and rollback procedure rather than replacing the key in place.
