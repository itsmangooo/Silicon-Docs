---
slug: /
title: Silicon documentation
sidebar_position: 1
---

# Silicon documentation

Silicon is a self-hosted infrastructure and application platform. It manages organization-scoped projects, environments, applications, deployments, Docker targets, GitHub sources, Cloudflare routing, AWS resources, secrets, audit history, and opt-in WireGuard private networks.

This site is independent from a Silicon installation. Use it to:

- [install Silicon](getting-started/installation.md) and complete a first deployment;
- operate [self-hosted](guides/self-hosted.md) or [AWS-backed](guides/aws.md) workloads;
- configure [GitHub](guides/github.md), [Cloudflare](guides/cloudflare.md), and [private networking](guides/private-networking.md);
- understand the [modular-monolith architecture](developers/architecture.md);
- set up a source checkout and [contribute](developers/contributing.md).

![Silicon dashboard with sanitized example resources](/img/screenshots/dashboard.png)

## Product boundaries

Silicon currently supports local Docker, verified SSH-connected Docker hosts, bounded AWS EC2/SSM operations, Cloudflare DNS and optional Tunnel, exact-revision GitHub App deployments, and private WireGuard overlays. It does not provide Kubernetes, Azure, Docker Compose workload execution, a custom reverse proxy, automatic TLS, or a generic remote shell.

The [Silicon repository](https://github.com/itsmangooo/Silicon) is the source of truth for code and releases. This documentation describes released behavior without requiring that repository at build or runtime.
