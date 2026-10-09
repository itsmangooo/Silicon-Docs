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

// Display order and assembly order are separate: preserve the exact node grid,
// while the Runtime -> Git -> Cloud -> Networking -> Secrets -> Mail story runs.
function providerPhase(category, index) {
  return {'Runtime': 0, 'Server connections': .35, 'Git source': 1, 'Cloud resources': 2,
    'DNS & tunnels': 3, 'Private networking': 3.4, 'Secrets': 4, 'System email': 5}[category] ?? index
}

function providerDelay(category, index, duration) {
  return duration * (1.65 + providerPhase(category, index) * .58)
}

function DesktopNode({category, implementation, x, y, index, full, inView, duration}) {
  const delay = providerDelay(category, index, duration)
  const shell = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * .35, delay: delay + duration * .28}})
  const label = useEntrance({full, inView, from: {opacity: 0, y: 6}, to: {opacity: 1, y: 0}, transition: {duration: duration * .35, delay: delay + duration * .4}})
  const lines = implementationLines(implementation)
  const center = x + geometry.node.width / 2
  return <g>
    <m.rect x={x} y={y} width={geometry.node.width} height={geometry.node.height} rx="12"
      className="provider-system__node-shape" initial={false} animate={shell} />
    <m.g initial={false} animate={label}>
      <text x={center} y={y + 42} textAnchor="middle" className="provider-system__category">{category}</text>
      <text x={center} y={y + 78} textAnchor="middle" className="provider-system__implementation">
        {lines.map((line, lineIndex) => <tspan key={lineIndex} x={center} dy={lineIndex === 0 ? 0 : 25}>{line}</tspan>)}
      </text>
    </m.g>
  </g>
}

function CompactNode({category, implementation, index, full, inView, duration}) {
  const node = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * .4, delay: providerDelay(category, index, duration)}})
  return <m.div className="provider-system__compact-node" initial={false} animate={node}>
    <dt>{category}</dt><dd>{implementation}</dd>
  </m.div>
}

function Contract({name, index, full, inView, duration, stagger, finalProviderPhase}) {
  const controls = useEntrance({full, inView, from: {opacity: 0, y: 6}, to: {opacity: 1, y: 0}, transition: {duration: duration * .5, delay: duration * (2.6 + finalProviderPhase * .58) + index * stagger}})
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
  const core = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * .35}})
  const frame = useEntrance({full, inView, from: {pathLength: 0, opacity: 0}, to: {pathLength: 1, opacity: 1}, transition: {duration: duration * .55, delay: duration * .35}})
  const labels = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * .35}})
  const providerDescription = providers.map(([category, implementation]) => `${category}: ${implementation}`).join('. ')
  const nodes = createProviderLayout(providers)
  const lastBus = geometry.buses[Math.floor((nodes.length - 1) / geometry.columns.length)]
  const spinePath = `M${providerSystemCoreAnchor.x} ${providerSystemCoreAnchor.y} V${lastBus}`
  const finalProviderPhase = Math.max(...providers.map(([category], index) => providerPhase(category, index)))

  return <div ref={ref} className="provider-system" data-diagram="provider-architecture" data-assembly={full ? inView ? 'running' : 'waiting' : 'static'}
    style={{'--assembly-spine-delay': `${duration * .9}s`, '--assembly-line-duration': `${duration * .65}s`}}>
    <svg className="provider-system__desktop" viewBox={`0 0 ${geometry.width} ${geometry.height}`} role="img"
      aria-labelledby={`${identifier}-title ${identifier}-description`}>
      <title id={`${identifier}-title`}>{`${coreLabel} and its implemented provider boundaries`}</title>
      <desc id={`${identifier}-description`}>{`${coreDetail}. Each solid provider node connects directly to the core. ${providerDescription}.`}</desc>
      <g fill="none">
        <DrawPath path={spinePath} full={full} inView={inView} delay={duration * .9} duration={duration * .65} />
        {nodes.map(({index, category, endAnchor}) => {
          const bus = geometry.buses[Math.floor(index / geometry.columns.length)]
          const branch = `M${providerSystemCoreAnchor.x} ${bus} H${endAnchor.x} V${endAnchor.y}`
          return <DrawPath key={index} path={branch} full={full} inView={inView}
            delay={providerDelay(category, index, duration)} duration={duration * .4} />
        })}
      </g>
      <m.rect {...geometry.core} rx="12" className="provider-system__core-shape" initial={false} animate={core} />
      <m.rect {...geometry.core} rx="12" className="provider-system__core-frame" vectorEffect="non-scaling-stroke" initial={false} animate={frame} />
      <m.g initial={false} animate={labels}>
        <text x={providerSystemCoreAnchor.x} y={geometry.core.y + 67} textAnchor="middle" className="provider-system__core-label">{coreLabel}</text>
        <text x={providerSystemCoreAnchor.x} y={geometry.core.y + 102} textAnchor="middle" className="provider-system__core-detail">{coreDetail}</text>
      </m.g>
      {nodes.map(({category, implementation, index, x, y}) => <DesktopNode key={category}
        category={category} implementation={implementation} index={index} x={x} y={y}
        full={full} inView={inView} duration={duration} />)}
    </svg>

    <div className="provider-system__compact">
      <m.div className="provider-system__compact-core" initial={false} animate={core}>
        <m.svg className="provider-system__compact-frame" viewBox="0 0 320 100" preserveAspectRatio="none" aria-hidden="true">
          <m.rect x="1" y="1" width="318" height="98" rx="12" className="provider-system__core-frame" vectorEffect="non-scaling-stroke" initial={false} animate={frame} />
        </m.svg>
        <strong>{coreLabel}</strong><span>{coreDetail}</span>
      </m.div>
      <dl className="provider-system__compact-list">
        {providers.map(([category, implementation], index) => <CompactNode key={category} category={category}
          implementation={implementation} index={index} full={full} inView={inView} duration={duration} />)}
      </dl>
    </div>

    <div className="provider-system__legend">
      <p className="provider-system__implemented"><span>Implemented today</span>{implementedSummary}</p>
      {extensionContracts.length > 0 && <div className="provider-system__extensions">
        <p>Extension contracts</p>
        <ul>{extensionContracts.map((name, index) => <Contract key={name} name={name} index={index} finalProviderPhase={finalProviderPhase}
          full={full} inView={inView} duration={duration} stagger={stagger} />)}</ul>
        {contractNote && <p className="provider-system__contract-note">{contractNote}</p>}
      </div>}
    </div>
  </div>
}
