# Environments

An environment is a project-owned configuration boundary such as `production`, `staging`, or `development`. Applications belong to exactly one environment.

Environment variables and secrets override project values. Application-specific values override both. Environments do not automatically provision infrastructure or create networks; targets, routing, and private-network attachment remain explicit.

Use separate environments when configuration, credentials, deployment approval, routing, or failure impact must differ.
