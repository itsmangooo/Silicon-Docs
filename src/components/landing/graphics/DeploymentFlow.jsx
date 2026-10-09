import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'
import useEntrance from '../motion/useEntrance'

const defaultStages = [
  {label: 'Commit', detail: 'Selected source revision'},
  {label: 'Exact SHA', detail: 'Immutable build input'},
  {label: 'Build', detail: 'Root Dockerfile'},
  {label: 'Docker runtime', detail: 'Deploy and inspect'},
]

function Connector({path, full, inView, delay, duration}) {
  const controls = useEntrance({full, inView, from: {pathLength: 0, opacity: 0}, to: {pathLength: 1, opacity: 1}, transition: {duration, delay}})
  return <m.path d={path} className="flow-path" initial={false} animate={controls} vectorEffect="non-scaling-stroke" />
}

function Stage({stage, index, full, inView, duration, interval}) {
  const controls = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * 0.6, delay: index * interval}})
  const marker = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * 0.55, delay: index * interval}})
  return <li className="flow-stage">
    <m.span className="flow-stage__marker" aria-hidden="true" initial={false} animate={marker}><span /></m.span>
    <m.div className="flow-stage__copy" initial={false} animate={controls}>
      <strong className="flow-stage__label">{stage.label}</strong>
      {stage.detail && <span className="flow-stage__detail">{stage.detail}</span>}
    </m.div>
  </li>
}

// Semantic process text stays complete. Lines assemble around it once, while
// source identity and runtime steps remain conceptual rather than live status.
export default function DeploymentFlow({stages = defaultStages, caption = 'From source revision to a running container · conceptual deployment path', className = ''}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration, stagger} = useLandingMotion()
  const full = ready && !reduced
  const interval = duration * 0.85 + stagger
  // SVG endpoints and the gapless CSS grid use the same equal-width tracks.
  // Markers remain in grid flow; no node has an independently positioned dot.
  const points = stages.map((_, index) => 1000 * (index + 0.5) / stages.length)
  return <figure ref={ref} className={`deployment-flow ${className}`} data-diagram="deployment-flow">
    <figcaption className="flow-caption">{caption}</figcaption>
    <div className="flow-graph">
      <svg className="flow-paths" viewBox="0 0 1000 18" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        {points.slice(0, -1).map((x, index) => {
          const path = `M${x} 9 H${points[index + 1]}`
          return <g key={index}><path d={path} className="flow-path-track" vectorEffect="non-scaling-stroke" />
            <Connector path={path} full={full} inView={inView} delay={index * interval + duration * 0.35} duration={duration * 0.45} /></g>
        })}
      </svg>
      <ol className="flow-stages" style={{'--flow-stage-count': stages.length}}>
        {stages.map((stage, index) => <Stage key={`${stage.label}-${index}`} stage={stage} index={index}
          full={full} inView={inView} duration={duration} interval={interval} />)}
      </ol>
    </div>
  </figure>
}
