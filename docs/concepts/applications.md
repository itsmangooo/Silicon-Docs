# Applications

An application is a deployable workload record. Supported sources are an explicit Docker image or GitHub-backed Git + root Dockerfile. Docker Compose is not currently executable and cannot be created as a supported source.

The internal port describes the container listener and does not publish it. A published host port additionally requires an explicit valid host address. Silicon uses `127.0.0.1` as the safe suggested local-only value and never silently binds `0.0.0.0`.

Applications select a usable runtime target, inherit configuration, preserve deployment history, expose typed runtime lifecycle/log actions, and may attach to one Silicon private network in the current model.
