# Organizations

An organization is Silicon's tenant and security boundary. Users and sessions are global; memberships assign a separate role per organization. All infrastructure and workload resources carry organization ownership directly or through tenant-qualified parents.

Backend queries scope reads, writes, and deletes by organization even when resource IDs are globally unique. Composite foreign keys prevent linking a project, application, server, integration, domain, budget, deployment, or network from one organization to a parent in another.

Switching organizations in the UI reloads tenant data, but frontend behavior is not treated as authorization. The API verifies membership and explicit permissions on every scoped request.
