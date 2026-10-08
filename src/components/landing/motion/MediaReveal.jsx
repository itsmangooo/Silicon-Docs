import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import useEntrance from './useEntrance'

export default function MediaReveal({children, className = '', variant = 'settle'}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.12})
  const {ready, reduced, desktopStory, duration, mediaRadius} = useLandingMotion()
  const radius = `round ${mediaRadius}px`
  const final = {clipPath: `inset(0% 0% 0% 0% ${radius})`, x: 0, y: 0, scale: 1}
  const entrances = {
    settle: {clipPath: `inset(0% 0% 32% 0% ${radius})`, x: 0, y: desktopStory ? 24 : 12, scale: 1.025},
    horizontal: {clipPath: `inset(0% 14% 0% 14% ${radius})`, x: 0, y: 0, scale: 1},
    slide: {clipPath: `inset(0% 12% 0% 0% ${radius})`, x: desktopStory ? 36 : 12, y: 0, scale: 1},
    rise: {clipPath: `inset(0% 0% 24% 0% ${radius})`, x: 0, y: desktopStory ? 32 : 16, scale: 1},
  }
  const entrance = entrances[variant] || entrances.settle
  const controls = useEntrance({full: ready && !reduced, inView, from: entrance, to: final, transition: {duration}})
  return <m.div ref={ref} className={`media-reveal media-reveal--${variant} ${className}`} initial={false}
    animate={controls}>{children}</m.div>
}
