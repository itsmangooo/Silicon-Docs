# Domains and routing

A domain points an application hostname at a normalized Silicon origin target. Configure the hostname, application/server, protocol, target port, provider, and routing mode under **Domains**.

![Domain target and routing mode](/img/screenshots/guide-domain-setup.png)

## Routing modes

- **DNS only** creates a direct record for a public server address. Your own reverse proxy, TLS, and firewall remain required.
- **Cloudflare proxied** creates the same public origin record with Cloudflare proxying enabled. It still does not configure the origin reverse proxy or certificate.
- **Cloudflare Tunnel** maps the hostname to a selected shared tunnel route and a local origin such as `http://127.0.0.1:18080`.

Silicon supports A, AAAA, and appropriate CNAME records. It stores the provider record ID and ownership state. An unrelated record produces **Conflict** rather than being overwritten; delete operations apply only to records Silicon owns.

Keep database/cache ports private. For same-host proxy or Tunnel routing, publish only to `127.0.0.1`. See [Cloudflare](cloudflare.md) for provider setup.
