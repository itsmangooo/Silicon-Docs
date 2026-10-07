import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'

export default function DiagramPath({d, order = 0}) {
  const {ready, reduced, stagger} = useLandingMotion()
  const ref = useRef(null)
  const inView = useInView(ref, {once: true})
  const visible = !ready || reduced || inView
  return <m.path ref={ref} d={d} fill="none" className="diagram-path" initial={false}
    animate={{pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0}}
    transition={{delay: reduced ? 0 : order * stagger}} />
}
