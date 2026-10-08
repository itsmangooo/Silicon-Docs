import React, {useRef} from 'react'
import {m, useScroll, useTransform} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'
// One bounded, native-scroll media response. No scroll interception or React ticks.
export default function HeroMediaStage({children, className = ''}) {
  const ref = useRef(null)
  const {ready, reduced, desktopStory} = useLandingMotion()
  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']})
  const y = useTransform(scrollYProgress, [.25, .7], [0, 28])
  return <m.div ref={ref} className={className} style={ready && !reduced && desktopStory ? {y} : undefined}>{children}</m.div>
}
