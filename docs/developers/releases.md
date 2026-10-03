# Releases

Production releases are stable tags matching `vMAJOR.MINOR.PATCH`. A successful push to `main` runs the complete CI gate. The serialized `auto-tag` job reads `.github/release-series`, allocates the next patch, and creates an annotated tag on the exact tested commit. The tag invokes the release workflow.

The release workflow validates the semantic tag, repeats backend/frontend/installer checks, builds production services, packages the source release, creates SHA-256 checksums, and publishes the GitHub Release. Publishing does not create another tag.

To move from `v0.1.x` to `v0.2.0`, deliberately change `.github/release-series` in a reviewed commit. Do not manually invent a second patch tag for an automatically released commit.

Build metadata flows through `SILICON_BUILD_VERSION`, `SILICON_BUILD_COMMIT`, and `SILICON_BUILD_TIME` into the backend binary/version API. The in-panel updater accepts only an exact stable GitHub Release and runs the preservation-safe installer path.
