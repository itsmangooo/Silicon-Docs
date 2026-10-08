import React from 'react'
import {m} from 'motion/react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import ChapterLabel from '../core/ChapterLabel'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import ScrollScene from '../motion/ScrollScene'
import {useLandingMotion} from '../motion/MotionProvider'

function Topology({topology, stage, isStatic}) {
  const {duration, ease} = useLandingMotion()
  const logo = useBaseUrl('/img/silicon-mark-flat.svg')
  return <div className="network-topology" data-diagram="private-network" data-stage={stage}>
    <p className="diagram-caption">Conceptual topology · not live infrastructure status</p>
    <p className="sr-only">A hub-and-spoke network connects a local host, a verified SSH Linux server, and an AWS EC2 instance over SSH to a reachable Linux hub. WireGuard connects the nodes, CoreDNS resolves application .internal names, and nftables enforces project access rules.</p>
    <div className="network-map" aria-hidden="true">
      <svg viewBox="0 0 940 470" className="network-paths" fill="none">
        {topology.nodes.map((node, index) => <g key={node.label}><path d={node.path} className="network-path-track" /><m.path d={node.path} className="network-path" initial={false} animate={{pathLength: isStatic || stage >= index ? 1 : 0}} transition={{duration: isStatic ? 0 : duration, ease}} /></g>)}
      </svg>
      <div className="network-nodes">{topology.nodes.map((node, index) => <m.div key={node.label} className={`network-node ${stage >= index ? 'is-connected' : ''}`} initial={false} animate={{scale: stage >= index ? 1 : .92, y: stage >= index ? 0 : 8}} transition={{duration: isStatic ? 0 : duration * .7, ease}}><span className="node-symbol">{['⌂', '↗', '☁'][index]}</span><strong>{node.label}</strong><small>{node.detail}</small><span className="network-name">{stage === 3 ? node.name : 'Application target'}</span></m.div>)}</div>
      <div className={`network-hub ${stage === 3 ? 'is-resolved' : ''}`}><span className="hub-mark"><img src={logo} width="28" height="28" alt="" /></span><strong>{topology.hub.label}</strong><small>{topology.hub.detail}</small><span>{stage === 3 ? 'Organization-owned private network' : 'Reachable hub'}</span></div>
    </div>
    <m.div className="network-hud glass-layer" initial={false} animate={{opacity: stage === 3 ? 1 : 0, y: stage === 3 ? 0 : 6}} transition={{duration: isStatic ? 0 : duration * .6}} aria-hidden="true"><span className="hud-dot" />.internal discovery + project policies<span className="hud-example">Conceptual network layer</span></m.div>
    <p className="network-access">{stage === 3 ? 'Same-project access · explicit cross-project policies' : 'Local → SSH → AWS → private application discovery'}</p>
  </div>
}
export default function NetworkChapter({content, topology}) {
  return <Chapter id={content.id} className="network-chapter">
    <EditorialStage><ChapterLabel>{content.label}</ChapterLabel><LineReveal lines={content.title} id="network-title" className="network-title" /><p className="lead network-lead">{content.description}</p></EditorialStage>
    <ScrollScene className="network-story" stages={content.stages.length}>{({stage, isStatic}) => <div className="network-sticky editorial-stage">
      <div className="network-story-copy"><div className="story-progress" aria-hidden="true">{content.stages.map((step, index) => <span key={step.label} className={stage >= index ? 'is-complete' : ''} />)}</div><ol className="story-stage-list">{content.stages.map((step, index) => <li key={step.label} className={stage === index ? 'is-current' : ''}><span>{step.label}</span><div className="stage-detail"><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></div>
      <Topology topology={topology} stage={stage} isStatic={isStatic} />
    </div>}</ScrollScene>
    <EditorialStage className="network-footnote"><p>{content.notes.join(' ')}</p><p className="small-note">{content.limitation}</p><Button variant="secondary" href={content.link.href}>{content.link.label}</Button></EditorialStage>
  </Chapter>
}
