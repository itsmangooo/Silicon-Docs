import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'

const paths = [
  'M90 88 C200 88 230 44 360 44',
  'M90 88 C200 88 230 132 360 132',
  'M360 44 C490 44 520 88 630 88',
  'M360 132 C490 132 520 88 630 88',
]
const points = [[90, 88], [360, 44], [360, 132], [630, 88]]

// Connection choices share one runtime. This is architecture, not live status.
export default function ServerTransport({
  sourceLabel = 'Platform',
  sourceDetail = 'Typed operations',
  localLabel = 'Local access',
  sshLabel = 'Verified SSH',
  targetLabel = 'Docker runtime',
  targetDetail = 'One lifecycle adapter',
  caption = 'Typed runtime operations reach Docker through local access or verified SSH.',
  className = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration, ease} = useLandingMotion()
  const visible = !ready || reduced || inView
  const transition = index => ({duration: reduced ? 0 : duration, delay: reduced ? 0 : index * duration * 0.12, ease})

  return <figure ref={ref} className={`server-transport ${className}`} data-diagram="server-transport">
    <figcaption className="transport-caption">{caption}</figcaption>
    <div className="transport-graph">
      <svg className="transport-paths" viewBox="0 0 720 176" fill="none" aria-hidden="true" focusable="false">
        {paths.map((path, index) => <g key={path}>
          <path d={path} className="transport-path-track" />
          <m.path d={path} className="transport-path" initial={false}
            animate={{pathLength: visible ? 1 : 0}}
            transition={transition(index < 2 ? 0 : 1)} />
        </g>)}
        {points.map(([x, y], index) => <m.circle key={index} cx={x} cy={y} r="3" className="transport-point" initial={false}
          animate={{opacity: visible ? 1 : 0}}
          transition={transition(index === 3 ? 2 : 0)} />)}
      </svg>
      <div className="transport-labels">
        <m.p className="transport-source" initial={false} animate={{y: visible ? 0 : 8}} transition={transition(0)}>
          <strong>{sourceLabel}</strong><span>{sourceDetail}</span>
        </m.p>
        <ul className="transport-methods" aria-label="Supported connection methods">
          <m.li className="transport-method transport-method--local" initial={false} animate={{y: visible ? 0 : 8}} transition={transition(1)}>{localLabel}</m.li>
          <m.li className="transport-method transport-method--ssh" initial={false} animate={{y: visible ? 0 : 8}} transition={transition(1)}>{sshLabel}</m.li>
        </ul>
        <m.p className="transport-target" initial={false} animate={{y: visible ? 0 : 8}} transition={transition(2)}>
          <strong>{targetLabel}</strong><span>{targetDetail}</span>
        </m.p>
      </div>
    </div>
  </figure>
}
