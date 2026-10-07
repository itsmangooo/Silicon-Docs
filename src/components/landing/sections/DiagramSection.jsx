import React from 'react'
import LandingSection from '../core/LandingSection'
import SectionHeader from '../core/SectionHeader'
import CTA from '../core/CTA'
import Reveal from '../motion/Reveal'
import DiagramPath from '../motion/DiagramPath'

export function NetworkSection({content}) {
  return <LandingSection id="networking" className="network-chapter">
    <div className="chapter-intro"><Reveal><SectionHeader id="networking" {...content} /></Reveal><Reveal><CTA {...content.link} variant="text">{content.link.label}</CTA></Reveal></div>
    <div className="network-diagram" role="img" aria-label="Conceptual private network: a reachable Linux WireGuard hub connects local, SSH, and AWS EC2 over SSH nodes. CoreDNS provides internal names and nftables enforces project policies.">
      <svg className="network-connections" viewBox="0 0 960 280" preserveAspectRatio="none" aria-hidden="true">
        <DiagramPath d="M480 60V135H160V235" /><DiagramPath d="M480 60V235" order={1} /><DiagramPath d="M480 60V135H800V235" order={2} />
      </svg>
      <Reveal className="network-hub"><span className="diagram-tag">NETWORK HUB</span><strong>{content.hub.title}</strong><span>{content.hub.detail}</span></Reveal>
      <div className="network-nodes">{content.nodes.map((node, i) => <Reveal key={node.title} order={i + 1} className="network-node">
        <span className="diagram-node-index">0{i + 1}</span><strong>{node.title}</strong><span className="network-node-method">{node.subtitle}</span><code>{node.service}</code>
      </Reveal>)}</div>
    </div>
    <div className="diagram-notes">{content.notes.map(note => <p key={note}>{note}</p>)}</div>
    <p className="chapter-limitation">{content.limitation}</p>
  </LandingSection>
}

export function ArchitectureSection({content}) {
  return <LandingSection id="architecture" className="architecture-chapter">
    <div className="architecture-composition">
      <Reveal><SectionHeader id="architecture" {...content} /><CTA {...content.link} variant="text">{content.link.label}</CTA></Reveal>
      <Reveal className="provider-diagram">
        <div className="provider-foundation"><span className="diagram-tag">MODULAR BACKEND</span><p>{content.foundation}</p></div>
        <p className="provider-boundary">Explicit provider interfaces <span aria-hidden="true">↓</span></p>
        <dl className="provider-list">{content.providers.map(([name, provider]) => <div key={name}><dt>{name}</dt><dd>{provider}</dd></div>)}</dl>
        <p className="provider-extensions"><span className="diagram-tag">EXTENSION POINTS</span>{content.extensions}</p>
      </Reveal>
    </div>
  </LandingSection>
}
