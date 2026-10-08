import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import useEntrance from './useEntrance'

export default function SupportingReveal({children, className = '', delay = 0.25}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, desktopStory, duration} = useLandingMotion()
  const controls = useEntrance({
    full: ready && !reduced, inView,
    from: {opacity: 0, x: desktopStory ? 16 : 8}, to: {opacity: 1, x: 0},
    transition: {duration, delay},
  })
  return <m.div ref={ref} className={`supporting-reveal ${className}`} initial={false}
    animate={controls}>{children}</m.div>
}
