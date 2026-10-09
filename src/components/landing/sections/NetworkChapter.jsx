import React, {useEffect, useRef, useState} from 'react'
import {m} from 'motion/react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import ScrollScene from '../motion/ScrollScene'
import DecodeText from '../motion/DecodeText'
import {useLandingMotion} from '../motion/MotionProvider'

function Topology({topology, stage, isStatic}) {
  const root = useRef(null)
  const {ready, reduced, duration, ease} = useLandingMotion()
  const [pointerEnabled, setPointerEnabled] = useState(false)
  const [selected, setSelected] = useState(0)
  const logo = useBaseUrl('/img/silicon-mark-flat.svg')
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)')
    const read = () => setPointerEnabled(ready && !reduced && query.matches && navigator.maxTouchPoints === 0)
    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [ready, reduced])
  useEffect(() => {
    if (!pointerEnabled) {
      root.current?.style.removeProperty('--network-rx')
      root.current?.style.removeProperty('--network-ry')
      root.current?.removeAttribute('data-pointer-inside')
    }
  }, [pointerEnabled])
  const move = event => {
    if (!pointerEnabled || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.min(bounds.width, Math.max(0, event.clientX - bounds.left))
    const y = Math.min(bounds.height, Math.max(0, event.clientY - bounds.top))
    const style = event.currentTarget.style
    style.setProperty('--reticle-x', `${x}px`)
    style.setProperty('--reticle-y', `${y}px`)
    style.setProperty('--network-rx', `${(y / bounds.height - .5) * -4}deg`)
    style.setProperty('--network-ry', `${(x / bounds.width - .5) * 6}deg`)
    event.currentTarget.dataset.pointerInside = 'true'
  }
  const leave = () => {
    root.current.style.setProperty('--network-rx', '0deg')
    root.current.style.setProperty('--network-ry', '0deg')
    root.current.removeAttribute('data-pointer-inside')
  }
  const node = topology.nodes[selected]
  return <div ref={root} className="network-topology" data-diagram="private-network" data-stage={stage}
    data-interactive={pointerEnabled ? 'true' : 'false'} onPointerMove={move} onPointerLeave={leave}>
    <p className="sr-only">A hub-and-spoke network connects local, verified SSH, and AWS EC2 hosts to a reachable Linux hub. Select a host to inspect its connection and discovery concepts. This diagram illustrates the architecture.</p>
    <div className="network-depth">
      <div className="network-map">
        <svg viewBox="0 0 900 500" preserveAspectRatio="none" className="network-paths" fill="none" aria-hidden="true">
          {topology.nodes.map((item, index) => {
            const x = 900 * (index + .5) / topology.nodes.length
            const path = `M${x} 174 C${x} 260 450 250 450 330`
            return <g key={item.label}><path d={path} className="network-path-track" /><m.path d={path} className="network-path" initial={false}
              animate={{pathLength: isStatic || stage >= index ? 1 : 0}} transition={{duration: isStatic ? 0 : duration, delay: isStatic ? 0 : .18, ease}} /></g>
          })}
        </svg>
        <div className="network-nodes">{topology.nodes.map((item, index) => <m.div key={item.label}
          className={`network-node ${isStatic || stage >= index ? 'is-connected' : ''}`} initial={false}
          animate={{opacity: isStatic || stage >= index ? 1 : .22, y: isStatic || stage >= index ? 0 : 10}}
          transition={{duration: isStatic ? 0 : duration * .55, ease}}>
          <button type="button" className="network-node-button" aria-pressed={selected === index}
            onClick={() => setSelected(index)} onFocus={() => setSelected(index)}>
            <span className="node-symbol" aria-hidden="true">{['⌂', '↗', '☁'][index]}</span>
            <strong>{item.label}</strong><span className="network-node-detail">{item.detail}</span>
            <span className="network-name">{isStatic || stage === 3 ? item.name : 'Application target'}</span>
            <span className="network-anchor" aria-hidden="true" />
          </button>
        </m.div>)}</div>
        <div className="network-hub"><span className="network-anchor" aria-hidden="true" /><span className="hub-mark"><img src={logo} width="26" height="26" alt="" /></span>
          <strong>{topology.hub.label}</strong><span>{topology.hub.detail}</span><span>Organization-owned private network</span>
        </div>
      </div>
    </div>
    <div className="network-info-panels">
      <div className="network-glass-panel"><span>Connection · {node.label}</span><strong><DecodeText key={node.detail} text={node.detail} active={isStatic || stage >= selected} /></strong></div>
      <div className="network-glass-panel"><span>{stage === 3 ? 'Discovery' : 'Transport'}</span><strong><DecodeText key={stage === 3 ? 'discovery' : 'peer'} text={stage === 3 ? '.internal discovery' : 'WireGuard peer'} active={isStatic || stage >= 0} /></strong></div>
    </div>
    <p className="network-access">{stage === 3 ? 'Same-project access · explicit cross-project policies' : 'Local → SSH → AWS → private application discovery'}</p>
    <span className="network-reticle" aria-hidden="true"><i /><span>Inspect</span></span>
  </div>
}
export default function NetworkChapter({content, topology}) {
  return <Chapter id={content.id} tone="charcoal" className="network-chapter">
    <EditorialStage><LineReveal lines={content.title} id="network-title" className="network-title" /><p className="lead network-lead">{content.description}</p></EditorialStage>
    <ScrollScene className="network-story" stages={content.stages.length}>{({stage, isStatic}) => <div className="network-sticky editorial-stage">
      <div className="network-story-copy"><div className="story-progress" aria-hidden="true">{content.stages.map((step, index) => <span key={step.label} className={stage >= index ? 'is-complete' : ''} />)}</div><ol className="story-stage-list">{content.stages.map((step, index) => <li key={step.label} className={stage === index ? 'is-current' : ''}><span>{step.label}</span><div className="stage-detail"><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></div>
      <Topology topology={topology} stage={stage} isStatic={isStatic} />
    </div>}</ScrollScene>
    <EditorialStage className="network-footnote"><p>{content.notes.join(' ')}</p><p className="small-note">{content.limitation}</p><Button variant="secondary" href={content.link.href}>{content.link.label}</Button></EditorialStage>
  </Chapter>
}
