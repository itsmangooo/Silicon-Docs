# AWS security

Prefer a dedicated IAM role assumed through STS with a unique External ID. Scope the trust policy to the Silicon host identity and grant only actions needed by enabled features. Static bootstrap keys are supported where necessary but are encrypted, omitted from reads, and less desirable than workload identity.

Silicon verifies `GetCallerIdentity` before storing an account and rejects an account-ID mismatch. Provider SDK types and errors do not cross directly into core responses.

Discovered AWS resources are external/read-only. Lifecycle or destructive actions require an explicit Silicon ownership record. Managed resources receive Silicon organization/resource tags. Import records authority without claiming Silicon created the resource.

SSM operations are bounded. SSM intentionally refuses stdin and secret-bearing file transfer because Run Command parameters are retained by AWS. Use verified SSH for Git archives, environment/secrets, Cloudflare Tunnel tokens, and WireGuard configuration.

Expose only required security-group ports, keep databases private, and do not grant delete/terminate permissions for inventory-only use. Costs are delayed provider data and estimates are not actual bills.
