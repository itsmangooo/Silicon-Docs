# Networking

Silicon keeps three concerns separate:

1. **Container ports** describe where a workload listens.
2. **Published host ports** explicitly expose that listener on one host address.
3. **Routing** maps domains through external DNS/proxy/Tunnel providers.

Silicon Networks add an optional fourth layer: organization-private WireGuard east-west connectivity with `.internal` service names and nftables policy. Cloudflare remains north-south ingress and is not coupled to WireGuard.

Silicon does not provide a custom reverse proxy, automatic TLS, shared Compose networking, NAT traversal, or a service mesh. Review [Private networking](../guides/private-networking.md) before attaching applications.
