import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'

const defaultStages = [
  {label: 'Commit', detail: 'Selected source revision'},
  {label: 'Exact SHA', detail: 'Immutable build input'},
  {label: 'Build', detail: 'Root Dockerfile'},
  {label: 'Docker runtime', detail: 'Deploy and inspect'},
]

// The ordered text is the complete diagram; SVG adds only connective geometry.
export default function DeploymentFlow({
  stages = defaultStages,
  caption = 'From source revision to a running container · conceptual deployment path',
  className = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration, ease} = useLandingMotion()
  const visible = !ready || reduced || inView
  const transition = index => ({
    duration: reduced ? 0 : duration,
    delay: reduced ? 0 : index * duration * 0.12,
    ease,
  })
  const points = stages.map((_, index) => 720 * (index + 0.5) / stages.length)

  return <figure ref={ref} className={`deployment-flow ${className}`} data-diagram="deployment-flow">
    <figcaption className="flow-caption">{caption}</figcaption>
    <div className="flow-graph">
      <svg className="flow-paths" viewBox="0 0 720 64" fill="none" aria-hidden="true" focusable="false">
        {points.slice(0, -1).map((x, index) => {
          const path = `M${x} 32 L${points[index + 1]} 32`
          return <g key={index}>
            <path d={path} className="flow-path-track" />
            <m.path d={path} className="flow-path" initial={false}
              animate={{pathLength: visible ? 1 : 0}}
              transition={transition(index)} />
          </g>
        })}
        {points.map((x, index) => <m.circle key={index} cx={x} cy="32" r="3" className="flow-point" initial={false}
          animate={{opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6}}
          transition={transition(index)} />)}
      </svg>
      <ol className="flow-stages" style={{'--flow-stage-count': stages.length}}>
        {stages.map((stage, index) => <m.li key={`${stage.label}-${index}`} className="flow-stage" initial={false}
          animate={{y: visible ? 0 : 10, opacity: visible ? 1 : 0}}
          transition={transition(index)}>
          <span className="flow-stage__marker" aria-hidden="true" />
          <strong className="flow-stage__label">{stage.label}</strong>
          {stage.detail && <span className="flow-stage__detail">{stage.detail}</span>}
        </m.li>)}
      </ol>
    </div>
  </figure>
}
