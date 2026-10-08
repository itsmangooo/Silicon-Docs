import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react'
import {LazyMotion, domAnimation, MotionConfig, useReducedMotion} from 'motion/react'
import {DEFAULT_DURATION, DEFAULT_EASE, DEFAULT_STAGGER, readDuration, readEase} from './settings.mjs'

const MotionSettings = createContext({
  ready: false,
  reduced: true,
  systemReduced: false,
  manualReduced: false,
  setManualReduced: () => {},
  desktopStory: false,
  duration: DEFAULT_DURATION,
  ease: DEFAULT_EASE,
  stagger: DEFAULT_STAGGER,
  mediaRadius: 24,
  chapterRadius: 72,
})

export const useLandingMotion = () => useContext(MotionSettings)

export default function MotionProvider({children, storageKey = 'landing-motion'}) {
  const preferenceKey = storageKey
  const root = useRef(null)
  const osReduced = useReducedMotion()
  const [systemReduced, setSystemReduced] = useState(null)
  const [manualReduced, setManualPreference] = useState(false)
  const [settings, setSettings] = useState({ready: false, desktopStory: false, duration: DEFAULT_DURATION, ease: DEFAULT_EASE, stagger: DEFAULT_STAGGER, mediaRadius: 24, chapterRadius: 72})

  const setManualReduced = useCallback(value => {
    const reduced = Boolean(value)
    setManualPreference(reduced)
    try {window.localStorage.setItem(preferenceKey, reduced ? 'reduced' : 'full')} catch {}
  }, [preferenceKey])

  useEffect(() => {
    try {setManualPreference(window.localStorage.getItem(preferenceKey) === 'reduced')} catch {}
    const initialCss = window.getComputedStyle(root.current)
    const minWidth = parseFloat(initialCss.getPropertyValue('--story-min-width'))
    const minHeight = parseFloat(initialCss.getPropertyValue('--story-min-height'))
    const width = Number.isFinite(minWidth) && minWidth > 0 ? minWidth : 1100
    const height = Number.isFinite(minHeight) && minHeight > 0 ? minHeight : 700
    const viewport = window.matchMedia(`(min-width: ${width}px) and (min-height: ${height}px)`)
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const readMotionPreference = () => setSystemReduced(motionPreference.matches)
    const read = () => {
      const css = window.getComputedStyle(root.current)
      const mediaRadius = parseFloat(css.getPropertyValue('--radius-media'))
      const chapterRadius = parseFloat(css.getPropertyValue('--radius-chapter'))
      setSettings({
        ready: true,
        desktopStory: viewport.matches,
        duration: readDuration(css.getPropertyValue('--motion-duration')),
        ease: readEase(css.getPropertyValue('--motion-ease')),
        stagger: readDuration(css.getPropertyValue('--motion-stagger'), DEFAULT_STAGGER),
        mediaRadius: Number.isFinite(mediaRadius) && mediaRadius >= 0 ? mediaRadius : 24,
        chapterRadius: Number.isFinite(chapterRadius) && chapterRadius >= 0 ? chapterRadius : 72,
      })
    }
    const onPreferenceChange = event => {
      if (event.key === preferenceKey) setManualPreference(event.newValue === 'reduced')
    }
    read()
    readMotionPreference()
    viewport.addEventListener('change', read)
    motionPreference.addEventListener('change', readMotionPreference)
    window.addEventListener('resize', read)
    window.addEventListener('storage', onPreferenceChange)
    return () => {
      viewport.removeEventListener('change', read)
      motionPreference.removeEventListener('change', readMotionPreference)
      window.removeEventListener('resize', read)
      window.removeEventListener('storage', onPreferenceChange)
    }
  }, [preferenceKey])

  const actualSystemReduced = Boolean(systemReduced ?? osReduced)
  const reduced = !settings.ready || actualSystemReduced || manualReduced
  const value = {...settings, reduced, systemReduced: actualSystemReduced, manualReduced, setManualReduced}
  return <div ref={root} className="landing-motion-layer" data-motion={!settings.ready ? 'pending' : reduced ? 'reduced' : 'full'}>
    <MotionSettings.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'} transition={{duration: value.duration, ease: value.ease}}>
        <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
      </MotionConfig>
    </MotionSettings.Provider>
  </div>
}
