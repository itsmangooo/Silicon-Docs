import React, {createContext, useContext, useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import {DEFAULT_DURATION, DEFAULT_STAGGER} from './settings.mjs'
import useEntrance from './useEntrance'

const AssemblySettings = createContext({full: false, inView: false, duration: DEFAULT_DURATION, stagger: DEFAULT_STAGGER})

export function AssemblyGroup({children, className = '', ...props}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.12})
  const {ready, reduced, duration, stagger} = useLandingMotion()
  const full = ready && !reduced
  return <div {...props} ref={ref} className={`assembly-group ${className}`}>
    <AssemblySettings.Provider value={{full, inView, duration, stagger}}>{children}</AssemblySettings.Provider>
  </div>
}

export function AssemblyItem({children, index = 0, className = '', as: Tag = 'div', ...props}) {
  const {full, inView, duration, stagger} = useContext(AssemblySettings)
  const Component = m[Tag]
  const controls = useEntrance({
    full, inView,
    from: {opacity: 0, scale: 0.96}, to: {opacity: 1, scale: 1},
    transition: {duration, delay: index * stagger},
  })
  return <Component {...props} className={`assembly-item ${className}`} initial={false}
    animate={controls}>{children}</Component>
}

export function AssemblyPath({d, index = 0, className = '', ...props}) {
  const {full, inView, duration, stagger} = useContext(AssemblySettings)
  const controls = useEntrance({
    full, inView,
    from: {pathLength: 0, opacity: 0}, to: {pathLength: 1, opacity: 1},
    transition: {duration, delay: index * stagger},
  })
  return <m.path fill="none" {...props} d={d} className={`assembly-path ${className}`} initial={false}
    animate={controls} />
}

export default AssemblyGroup
