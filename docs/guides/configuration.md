# Environment variables and secrets

Configuration can be defined at project, environment, and application scope. Resolution order is application over environment over project.

## Environment variables

Use variables for readable, non-sensitive values such as log level, feature mode, or public API URL. Silicon accepts reviewed `.env` text and previews parsed names and values before applying it.

![Environment variable editor](/img/screenshots/guide-environment-variables.png)

## Secrets

Use secrets for passwords, API tokens, connection strings, and private credentials. The local secret provider encrypts values with AES-256-GCM and organization/scope/name authenticated context. Ordinary reads return names and metadata, never plaintext values.

![Write-only secret form](/img/screenshots/guide-secrets.png)

Do not put secrets in normal variables, audit metadata, screenshots, or Docker image layers. Back up `SILICON_ENCRYPTION_KEY` separately: losing it makes encrypted provider and application credentials unrecoverable. Docker administrators on a target can inspect container configuration and remain part of the trusted boundary.
