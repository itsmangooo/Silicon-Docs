# Expose Silicon on a custom domain

Installation administrators can publish the Silicon panel itself through an existing Cloudflare Tunnel. This installation-global setting is separate from application domains owned by an organization.

```mermaid
flowchart LR
  Internet -->|HTTPS| Cloudflare[Cloudflare edge]
  Cloudflare --> Tunnel[Cloudflare Tunnel]
  Tunnel -->|HTTP loopback| Frontend[Silicon frontend]
  Frontend -->|/api| Backend[Silicon backend]
```

Cloudflare terminates public HTTPS. Silicon does not issue a certificate or install Caddy, Traefik, or another reverse proxy.

[![Silicon installation public access settings](/img/screenshots/settings-public-access.png)](/img/screenshots/settings-public-access.png)

## Prerequisites

You need both installation and organization authority:

- your user is a Silicon installation administrator;
- your user is Owner or Admin in the organization that owns the Cloudflare connection;
- the Cloudflare API token has scoped Zone Read, DNS Edit, and Tunnel Edit permissions;
- the intended zone is active;
- an official `cloudflared` Tunnel is installed on the **local Silicon host**.

The selected Cloudflare resources remain owned by their organization. Public access stores references to that organization, connection, zone, and Tunnel and prevents unsafe cross-organization combinations.

## Configure the hostname

1. Connect Cloudflare under **Integrations** and verify the intended zone.
2. Create or select a Tunnel and install it on the local Silicon server.
3. Open **Settings → Public access**.
4. Select the Cloudflare connection, zone, and local Tunnel.
5. Enter a hostname within the selected zone, such as `silicon.example.com`.
6. Select **Configure**.
7. Wait while the operation moves through validation, Cloudflare configuration, host configuration, restart, and health verification.
8. Continue at `https://silicon.example.com` when the browser reconnects.

Silicon refuses an unrelated existing DNS record or Tunnel hostname. It creates a proxied CNAME to `<tunnel-id>.cfargotunnel.com` and a Tunnel ingress route to:

```text
http://127.0.0.1:<existing SILICON_HTTP_PORT>
```

## Host changes and restart scope

The privileged helper is deliberately narrow. It may update only:

```dotenv
SILICON_PUBLIC_URL=https://silicon.example.com
SILICON_COOKIE_SECURE=true
SILICON_TRUST_FORWARDED_PROTO=true
SILICON_BIND_ADDRESS=127.0.0.1
```

It preserves `SILICON_HTTP_PORT`, `POSTGRES_PASSWORD`, `SILICON_ENCRYPTION_KEY`, all database settings, other `silicon.env` entries, PostgreSQL data, and persistent directories. It validates Compose and recreates only `backend` and `frontend`; PostgreSQL and the host are not restarted.

Loopback binding is intentional: the host HTTP port is no longer exposed on every LAN interface while Tunnel-only access is active. Direct LAN access may stop working.

## Change or disable public access

Changing the domain prepares the new hostname before removing the old Silicon-owned hostname where possible. Silicon preserves unrelated ingress routes on a shared Tunnel.

**Disable Public Access** restores the snapshotted local URL, cookie mode, forwarded-protocol setting, and bind address. It removes only the DNS record and ingress hostname owned by installation public access. It never deletes the shared Tunnel.

## Failure safety

The PostgreSQL operation record survives backend restarts and records the failed stage. Before host mutation, Silicon persists the previous allowed settings. A failed Compose validation, service recreation, or health check restores the exact previous `silicon.env` content and prior backend/frontend configuration. A failed Cloudflare preparation leaves host configuration unchanged and removes only newly created Silicon-owned resources.

## Troubleshooting

### The Tunnel is unavailable

Confirm it is installed on the local Silicon server, not only on an SSH/AWS workload target. Check the official `cloudflared` container status from **Integrations**.

### The hostname conflicts

Inspect both Cloudflare DNS and Tunnel ingress. Silicon will not overwrite a record or route it does not already own.

### Login or unsafe API requests fail

Confirm the configured hostname exactly matches the browser origin and Cloudflare forwards HTTPS. Do not disable secure cookies, origin checks, or CSRF protection.

### The browser cannot reconnect

Use host console access to inspect the durable operation status and local service health. Verify zone delegation, the proxied CNAME, Tunnel connectivity, and that no Cloudflare Access policy is unexpectedly intercepting the route.
