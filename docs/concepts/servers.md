# Servers

A server is an organization-owned deployment target with a connection type and runtime status.

- **Local** uses bounded local process access and is available only when explicitly enabled.
- **SSH** uses encrypted credentials and mandatory host-key verification.
- **AWS SSM** supports bounded operations that do not require stdin or secret-bearing file transfer.
- **AWS EC2 over SSH** behaves as an SSH-connected Docker target and supports Git builds, secrets, Tunnel installation, and private networking.

Active checks report SSH reachability, authentication, Docker availability/version, OS, architecture, and last check. Unreachable or Docker-unavailable targets remain visible but cannot be selected as usable deployment targets.
