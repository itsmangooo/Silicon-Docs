import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'

export default function Reveal({children, className = '', order = 0, media = false}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.12})
  const {ready, reduced, travel, stagger, mediaScale} = useLandingMotion()
  const visible = !ready || inView || reduced
  return <m.div ref={ref} className={`landing-reveal ${className}`} initial={false}
    animate={{opacity: visible ? 1 : 0, y: visible ? 0 : travel, scale: media && !reduced && !visible ? mediaScale : 1}}
    transition={{delay: reduced ? 0 : order * stagger}}>{children}</m.div>
}
