import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'
import useEntrance from '../motion/useEntrance'

// The product frame carries the visual, without capture-tool annotations.
// Its ambient layer is decorative; the linked screenshot stays in normal flow.
export default function HeroMediaStage({children, className = ''}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: .15})
  const {ready, reduced, duration} = useLandingMotion()
  const panel = useEntrance({full: ready && !reduced, inView, from: {y: 18, opacity: 0}, to: {y: 0, opacity: 1}, transition: {duration, delay: .25}})
  const rule = useEntrance({full: ready && !reduced, inView, from: {scaleX: 0}, to: {scaleX: 1}, transition: {duration: duration * 1.2}})
  return <div ref={ref} className={`hero-media-stage ${className}`}>
    <span className="hero-media-stage__halo" aria-hidden="true" />
    <m.span className="hero-media-stage__rule" aria-hidden="true" initial={false} animate={rule} />
    {children}
    <m.aside className="hero-media-stage__capabilities" aria-label="Deployment capabilities" initial={false} animate={panel}>
      <dl><div><dt>Runtime</dt><dd>Docker</dd></div><div><dt>Revision</dt><dd>Exact SHA</dd></div><div><dt>Target</dt><dd>Local / SSH / AWS</dd></div></dl>
    </m.aside>
  </div>
}
