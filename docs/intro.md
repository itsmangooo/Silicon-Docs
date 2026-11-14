---
slug: /
title: Silicon documentation
sidebar_position: 1
---

# Silicon documentation

Silicon helps you deploy applications to servers you control. You can start with a single Linux server and a test website, then add GitHub, a public hostname, or AWS when you need them.

This site is independent from a Silicon installation. Use it to:

- [install Silicon and deploy a test website](getting-started/install-walkthrough.md) step by step;
- [find the right screen for a task](guides/feature-reference.md);
- operate [self-hosted](guides/self-hosted.md) or [AWS-backed](guides/aws.md) workloads;
- configure [GitHub](guides/github.md), [Cloudflare](guides/cloudflare.md), [system email and password recovery](guides/system-email.md), and [private networking](guides/private-networking.md);
- publish an app through [Nginx or Traefik](guides/external-proxy.md), or use a Cloudflare Tunnel;
- understand the [modular-monolith architecture](developers/architecture.md);
- set up a source checkout and [contribute](developers/contributing.md).

![Silicon dashboard with sanitized example resources](/img/screenshots/theme-dashboard.png)

## Product boundaries

Silicon currently supports local Docker, verified SSH-connected Docker hosts, bounded AWS EC2/SSM operations, Cloudflare DNS and optional Tunnel, exact-revision GitHub App deployments, and private WireGuard overlays. It does not provide Kubernetes, Azure, Docker Compose workload execution, a custom reverse proxy, automatic TLS, or a generic remote shell.

The [Silicon repository](https://github.com/itsmangooo/Silicon) is the source of truth for code and releases. This documentation describes released behavior without requiring that repository at build or runtime.
