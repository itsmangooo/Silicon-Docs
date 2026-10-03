# Private networking security

Silicon Networks use organization-qualified database relationships from network through member, service, policy, operation, application, project, and server. CIDRs must be canonical private IPv4 ranges and cannot overlap another Silicon Network in the organization.

Every target generates its WireGuard private key locally and stores it mode `0600` under `/var/lib/silicon/wireguard`. The control plane receives only the public key. Configuration is validated before activation, and the prior file is restored if activation fails.

The provider changes only the network-specific WireGuard interface, Silicon-labelled CoreDNS container, sysctl file, and network-specific nftables table. It does not flush unrelated firewall state or automatically rewrite imported AWS security groups.

Same-project access is allowed; cross-project access is denied without an explicit same-organization application-to-service rule. Database/service ports should remain overlay-only with narrow policies.

The hub is an availability and bandwidth dependency. Restrict UDP 51820 (or the chosen port) to expected spoke sources and monitor handshakes. There is no NAT traversal, automatic relay, direct-peer optimization, or high-availability hub today.
