# Deployments

A deployment is historical state, not just the currently running container. It records application/environment identity, source, exact revision, trigger, actor or webhook delivery, state, timestamps, ordered events, and rollback/redeploy relationships.

States are explicit: queued, preparing, building, deploying, starting, healthy, failed, cancelled, superseded, and rolled back. Invalid transitions are rejected. Per-application ordering prevents an older queued push from replacing a newer successful revision.

Manual, GitHub push, rollback, and redeploy triggers enter the same PostgreSQL-backed pipeline. Webhook acceptance alone is never reported as successful deployment.
