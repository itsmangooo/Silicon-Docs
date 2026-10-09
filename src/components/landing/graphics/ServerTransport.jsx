import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'
import useEntrance from '../motion/useEntrance'

function Node({children, className, full, inView, duration, delay}) {
  const controls = useEntrance({full, inView, from: {opacity: 0}, to: {opacity: 1}, transition: {duration: duration * 0.65, delay}})
  return <m.div className={`transport-node ${className}`} initial={false} animate={controls}>
    {children}<span className="transport-anchor" aria-hidden="true" />
  </m.div>
}

function Paths({vertical = false, full, inView, duration}) {
  const controls = useEntrance({
    full, inView,
    from: {clipPath: vertical ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)'},
    to: {clipPath: 'inset(0 0 0 0)'},
    transition: {duration: duration * 1.4, delay: duration * 0.3},
  })
  const paths = vertical
    ? ['M160 0 C20 30 20 170 160 200', 'M160 0 C300 30 300 170 160 200']
    : ['M0 130 C68 14 332 14 400 130', 'M0 130 C68 246 332 246 400 130']
  return <svg className={`transport-paths transport-paths--${vertical ? 'vertical' : 'horizontal'}`}
    viewBox={vertical ? '0 0 320 200' : '0 0 400 260'} preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
    <m.g initial={false} animate={controls}>
      {paths.map((path, index) => <path key={path} d={path}
        className={`transport-path transport-path--${index === 0 ? 'local' : 'ssh'}`} vectorEffect="non-scaling-stroke" />)}
    </m.g>
  </svg>
}

// The center grid track owns the arcs. Its left/right edges are also the
// source/target anchors, so changing width cannot disconnect a path from a node.
export default function ServerTransport({sourceLabel = 'Platform', sourceDetail = 'Typed operations', localLabel = 'Local access', sshLabel = 'Verified SSH', targetLabel = 'Docker runtime', targetDetail = 'One lifecycle adapter', caption = 'Typed operations use either local access or verified SSH to reach the same Docker runtime.', className = ''}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration} = useLandingMotion()
  const full = ready && !reduced
  return <figure ref={ref} className={`server-transport ${className}`} data-diagram="server-transport">
    <figcaption className="sr-only">{caption}</figcaption>
    <div className="transport-graph">
      <Node className="transport-source" full={full} inView={inView} duration={duration} delay={0}>
        <strong>{sourceLabel}</strong><span className="transport-node__detail">{sourceDetail}</span>
      </Node>
      <Paths full={full} inView={inView} duration={duration} />
      <Paths vertical full={full} inView={inView} duration={duration} />
      <ul className="transport-methods" aria-label="Alternative server connections">
        <li className="transport-method transport-method--local">{localLabel}</li>
        <li className="transport-method transport-method--ssh">{sshLabel}</li>
      </ul>
      <Node className="transport-target" full={full} inView={inView} duration={duration} delay={duration * 1.5}>
        <strong>{targetLabel}</strong><span className="transport-node__detail">{targetDetail}</span>
      </Node>
    </div>
  </figure>
}
