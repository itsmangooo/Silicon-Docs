// Conceptual topology, never invented live infrastructure status.
export const networkTopology = {
  hub: {label: 'Linux hub', detail: 'WireGuard · CoreDNS · nftables'},
  nodes: [
    {label: 'Local host', detail: 'Local connection', name: 'api.production.home.internal', x: 140, path: 'M140 160 C140 310 470 230 470 360'},
    {label: 'Linux server', detail: 'Verified SSH', name: 'worker.production.jobs.internal', x: 470, path: 'M470 160 L470 360'},
    {label: 'AWS EC2', detail: 'SSH connection', name: 'backend.production.cloud.internal', x: 800, path: 'M800 160 C800 310 470 230 470 360'},
  ],
}
