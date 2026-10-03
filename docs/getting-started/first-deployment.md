# First deployment

This path deploys an existing Docker image. For Git source builds, complete the [GitHub App guide](../guides/github.md).

1. Create a **Project**.
2. Open it and add an environment such as `production`.
3. Add and verify a deployment target under **Servers**, or explicitly enable the local Docker provider in a development installation.
4. Open **Applications → Create application**.
5. Select the project environment, choose **Docker image**, and enter an exact image reference.
6. Select only a server that reports Connected and Docker Available.
7. Enter the container's internal port when the workload listens for traffic.
8. Leave published port empty unless a host process must reach it. If publishing is required, specify a valid host IP; `127.0.0.1` is the safe local-only default.
9. Store ordinary settings as environment variables and credentials as encrypted secrets.
10. Open the application and queue a deployment.

![Application creation with source and target selection](/img/screenshots/application-create.png)

Open the deployment record to inspect its persisted states and events. Then inspect the current runtime and logs from the application workspace. Silicon does not fabricate health, deployment results, or runtime output.

![Deployment detail and event history](/img/screenshots/deployment-detail.png)

For a complete two-service production walkthrough, use [Frontend + backend](../guides/frontend-backend.md).
