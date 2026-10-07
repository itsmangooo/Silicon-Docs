import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import {LazyMotion, domAnimation, MotionConfig, useReducedMotion} from 'motion/react'

const MotionSettings = createContext({ready: false, reduced: true, mobile: true, duration: 0, travel: 0, stagger: 0, ease: [0.22, 1, 0.36, 1]})
export const useLandingMotion = () => useContext(MotionSettings)

export default function MotionProvider({children}) {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const [settings, setSettings] = useState(null)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const read = () => {
      const css = getComputedStyle(root.current)
      setSettings({
        ready: true, mobile: media.matches,
        duration: parseFloat(css.getPropertyValue('--motion-base')) / 1000,
        travel: parseFloat(css.getPropertyValue(media.matches ? '--motion-travel-mobile' : '--motion-travel')),
        stagger: parseFloat(css.getPropertyValue('--motion-stagger')) / 1000,
        mediaScale: parseFloat(css.getPropertyValue('--motion-media-scale')),
        ease: css.getPropertyValue('--motion-ease-values').split(',').map(Number),
      })
    }
    read(); media.addEventListener('change', read)
    return () => media.removeEventListener('change', read)
  }, [])
  const value = {...useContext(MotionSettings), ...settings, reduced: Boolean(reduced)}
  return <div ref={root} className="landing-motion-root">
    <MotionSettings.Provider value={value}>
      <MotionConfig reducedMotion="user" transition={{duration: value.duration, ease: value.ease}}>
        <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
      </MotionConfig>
    </MotionSettings.Provider>
  </div>
}
