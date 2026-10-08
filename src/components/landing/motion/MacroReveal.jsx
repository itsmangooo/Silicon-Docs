import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import useEntrance from './useEntrance'

export default function MacroReveal({children, className = '', variant = 'frame', as: Tag = 'div', ...props}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.12})
  const {ready, reduced, desktopStory, duration, chapterRadius} = useLandingMotion()
  const Component = m[Tag]
  const shell = variant === 'shell'
  const from = shell
    ? {clipPath: `inset(12% 0% 0% 0% round ${chapterRadius}px)`, y: desktopStory ? 36 : 16, x: 0, scale: 1}
    : {x: desktopStory ? 48 : 16, y: 0, scale: 0.985}
  const to = shell
    ? {clipPath: 'inset(0% 0% 0% 0% round 0px)', y: 0, x: 0, scale: 1}
    : {x: 0, y: 0, scale: 1}
  const controls = useEntrance({full: ready && !reduced, inView, from, to, transition: {duration}})
  return <Component {...props} ref={ref} className={`macro-reveal macro-reveal--${variant} ${className}`} initial={false}
    animate={controls}>{children}</Component>
}
