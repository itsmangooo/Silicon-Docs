import React, {useId, useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'
import useEntrance from '../motion/useEntrance'
import {providerSystemGeometry as geometry, providerSystemCoreAnchor, createProviderLayout} from './provider-geometry.mjs'
export {providerSystemGeometry, providerSystemCoreAnchor, createProviderLayout} from './provider-geometry.mjs'

// Boxes and connector endpoints share this one coordinate model. No DOM
// measurements or viewport-specific offsets are used by the desktop diagram.
function implementationLines(value) {
  const words = value.split(' · ')
  const lines = []
  for (const word of words) {
    const previous = lines.at(-1)
    if (previous && `${previous} · ${word}`.length <= 24) lines[lines.length - 1] = `${previous} · ${word}`
    else lines.push(word)
  }
  return lines
}

function DrawPath({path, full, inView, delay, duration}) {
  const controls = useEntrance({full, inView, from: {pathLength: 0, opacity: 0}, to: {pathLength: 1, opacity: 1}, transition: {duration, delay}})
  return <m.path d={path} className="provider-system__path" vectorEffect="non-scaling-stroke" initial={false} animate={controls} />
}

function DesktopNode({category, implementation, x, y, index, full, inView, duration, stagger}) {
  const shell = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * 0.55, delay: duration * 0.8 + index * stagger}})
  const label = useEntrance({full, inView, from: {opacity: 0, y: 6}, to: {opacity: 1, y: 0}, transition: {duration: duration * 0.6, delay: duration * 1.15 + index * stagger}})
  const lines = implementationLines(implementation)
  const center = x + geometry.node.width / 2
  return <g>
    <m.rect x={x} y={y} width={geometry.node.width} height={geometry.node.height} rx="8"
      className="provider-system__node-shape" initial={false} animate={shell} />
    <m.g initial={false} animate={label}>
      <text x={center} y={y + 42} textAnchor="middle" className="provider-system__category">{category}</text>
      <text x={center} y={y + 78} textAnchor="middle" className="provider-system__implementation">
        {lines.map((line, lineIndex) => <tspan key={lineIndex} x={center} dy={lineIndex === 0 ? 0 : 25}>{line}</tspan>)}
      </text>
    </m.g>
  </g>
}

function CompactNode({category, implementation, index, full, inView, duration, stagger}) {
  const node = useEntrance({full, inView, from: {opacity: 0, y: 8}, to: {opacity: 1, y: 0}, transition: {duration: duration * 0.6, delay: duration * 1.15 + index * stagger}})
  return <m.div className="provider-system__compact-node" initial={false} animate={node}>
    <dt>{category}</dt><dd>{implementation}</dd>
  </m.div>
}

function Contract({name, index, full, inView, duration, stagger, providerCount}) {
  const controls = useEntrance({full, inView, from: {opacity: 0, y: 6}, to: {opacity: 1, y: 0}, transition: {duration: duration * 0.6, delay: duration * 1.8 + (providerCount + index) * stagger}})
  return <m.li className="provider-system__contract" initial={false} animate={controls}>{name}</m.li>
}

export default function ProviderSystem({
  providers,
  coreLabel = 'Core',
  coreDetail = 'Modular monolith',
  implementedSummary,
  extensionContracts = [],
  contractNote,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.16})
  const {ready, reduced, duration, stagger} = useLandingMotion()
  const full = ready && !reduced
  const identifier = useId().replace(/:/g, '')
  const core = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * 0.6}})
  const labels = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * 0.5, delay: stagger}})
  const providerDescription = providers.map(([category, implementation]) => `${category}: ${implementation}`).join('. ')
  const nodes = createProviderLayout(providers)

  return <div ref={ref} className="provider-system" data-diagram="provider-architecture">
    <svg className="provider-system__desktop" viewBox={`0 0 ${geometry.width} ${geometry.height}`} role="img"
      aria-labelledby={`${identifier}-title ${identifier}-description`}>
      <title id={`${identifier}-title`}>{`${coreLabel} and its implemented provider boundaries`}</title>
      <desc id={`${identifier}-description`}>{`${coreDetail}. Each solid provider node connects directly to the core. ${providerDescription}.`}</desc>
      <g fill="none">
        {nodes.map(({index, path}) => <DrawPath key={index} path={path} full={full} inView={inView}
          delay={duration * 0.5 + index * stagger} duration={duration * 0.6} />)}
      </g>
      <m.rect {...geometry.core} rx="12" className="provider-system__core-shape" initial={false} animate={core} />
      <m.g initial={false} animate={labels}>
        <text x={providerSystemCoreAnchor.x} y={geometry.core.y + 67} textAnchor="middle" className="provider-system__core-label">{coreLabel}</text>
        <text x={providerSystemCoreAnchor.x} y={geometry.core.y + 102} textAnchor="middle" className="provider-system__core-detail">{coreDetail}</text>
      </m.g>
      {nodes.map(({category, implementation, index, x, y}) => <DesktopNode key={category}
        category={category} implementation={implementation} index={index} x={x} y={y}
        full={full} inView={inView} duration={duration} stagger={stagger} />)}
    </svg>

    <div className="provider-system__compact">
      <m.div className="provider-system__compact-core" initial={false} animate={core}>
        <strong>{coreLabel}</strong><span>{coreDetail}</span>
      </m.div>
      <dl className="provider-system__compact-list">
        {providers.map(([category, implementation], index) => <CompactNode key={category} category={category}
          implementation={implementation} index={index} full={full} inView={inView} duration={duration} stagger={stagger} />)}
      </dl>
    </div>

    <div className="provider-system__legend">
      <p className="provider-system__implemented"><span>Implemented today</span>{implementedSummary}</p>
      {extensionContracts.length > 0 && <div className="provider-system__extensions">
        <p>Extension contracts</p>
        <ul>{extensionContracts.map((name, index) => <Contract key={name} name={name} index={index} providerCount={providers.length}
          full={full} inView={inView} duration={duration} stagger={stagger} />)}</ul>
        {contractNote && <p className="provider-system__contract-note">{contractNote}</p>}
      </div>}
    </div>
  </div>
}
