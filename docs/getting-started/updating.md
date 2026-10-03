# Updating Silicon

Production updates use stable GitHub Releases tagged exactly `vMAJOR.MINOR.PATCH`; they never update from `main`. Open **Settings → Updates** to see the compiled version, commit, latest release notes, and durable update state.

Only an installation-level system administrator may trigger an update. The updater verifies the release and exact tag, checks the existing configuration and PostgreSQL data, validates Compose, builds before replacement, runs normal forward migrations, replaces the application services, and waits for health. Expect a short service restart; Silicon does not claim zero downtime.

![Tagged release update status](/img/screenshots/settings-updates.png)

Before updating:

1. Back up `config/silicon.env` and PostgreSQL using a consistent database backup.
2. Confirm the encryption key and database password are included in protected backup material.
3. Read release notes and migrations.
4. Check available disk space.
5. Start the exact offered tag and keep the browser open while it reconnects.

The update path never runs `docker compose down -v`, deletes persistent volumes, resets the schema, regenerates secrets, or overwrites the existing HTTP port/public URL. If preflight or preparation fails, the current services remain in place. See [Updater security](../security/updater.md).
