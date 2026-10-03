# SSH security

SSH private keys are validated, encrypted at rest with organization/server authenticated context, omitted from API reads, and decrypted only after the organization-scoped server lookup succeeds.

Host-key verification is mandatory:

1. First contact reports the presented SHA-256 fingerprint without trusting it.
2. Verify that fingerprint through the server console or another trusted path.
3. Explicitly trust the exact value in Silicon.
4. Future mismatches block checks and runtime operations until deliberate re-trust.

A changed key may indicate reinstall, address reuse, or interception. Investigate before approving it.

Silicon has no generic remote-shell endpoint. Internal adapters invoke fixed programs with independently quoted arguments, deadlines, bounded output, and protected file staging. Remote environment/secret files are mode `0600` and removed after use.

Use a dedicated account with Docker access and only the required non-interactive privileges. Disable password authentication where practical, restrict port 22 to administrative/Silicon sources, and never store a sudo password in Silicon.
