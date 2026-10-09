import React, {useEffect, useRef, useState} from 'react'
import {m, MotionConfig, useAnimationControls, useInView} from 'motion/react'
import Chapter from '../compositions/Chapter'
import {useLandingMotion} from './MotionProvider'

const hidden = {opacity: 0, visibility: 'hidden', y: 24}
const shown = {opacity: 1, visibility: 'visible', y: 0}
const contentHidden = {opacity: 0, visibility: 'hidden'}
const contentShown = {opacity: 1, visibility: 'visible'}
const entry = {height: 200, y: 56}

// Only the background grows. The chapter and screenshot keep their natural
// content dimensions; a bounded 200px cap is the entire empty entrance stage.
export default function PaperChapter({id, className, children}) {
  const anchor = useRef(null)
  const complete = useRef(false)
  const inView = useInView(anchor, {once: true, amount: 0})
  const {ready, reduced, duration, ease} = useLandingMotion()
  const surface = useAnimationControls()
  const heading = useAnimationControls()
  const supporting = useAnimationControls()
  const content = useAnimationControls()
  const [stage, setStage] = useState('pending')

  useEffect(() => {
    if (!ready) return
    const chapter = anchor.current.parentElement
    const controls = [surface, heading, supporting, content]
    let cancelled = false
    const settle = () => {
      surface.set({height: '100%', y: 0})
      heading.set(shown)
      supporting.set(shown)
      content.set(contentShown)
      chapter.style.setProperty('--paper-edge', '100000px')
      complete.current = true
      setStage('complete')
    }
    if (reduced || complete.current) {settle(); return}
    if (!inView) return
    const bounds = chapter.getBoundingClientRect()
    // A deep link/large scroll jump should land on readable completed content.
    if (bounds.top < -200) {settle(); return}
    const title = chapter.querySelector('h2').getBoundingClientRect()
    chapter.style.setProperty('--paper-title-bottom', `${title.bottom - bounds.top + 24}px`)
    chapter.style.setProperty('--paper-edge', `${entry.height + entry.y}px`)
    async function reveal() {
      setStage('surface')
      await surface.start({height: 200, y: 0}, {duration: .18, ease})
      if (cancelled) return
      setStage('content')
      heading.set({visibility: 'visible'})
      supporting.set({visibility: 'visible'})
      content.set({visibility: 'visible'})
      // The title starts with the expansion, not after the full-height shell.
      // Its bottom edge is clipped only where paper has not arrived yet.
      await Promise.all([
        surface.start({height: bounds.height, y: 0}, {duration: duration * .7, ease}),
        heading.start(shown, {duration: duration * .55, ease}),
        supporting.start(shown, {duration: duration * .5, delay: .16, ease}),
        content.start(contentShown, {duration: duration * .45, delay: .3, ease}),
      ])
      if (!cancelled) settle()
    }
    reveal()
    return () => {cancelled = true; controls.forEach(control => control.stop())}
  }, [ready, reduced, inView, duration, ease, surface, heading, supporting, content])

  // Mount this chapter against the real OS preference rather than the parent's
  // temporary hydration fallback, which Motion snapshots on element mount.
  return <MotionConfig reducedMotion="user"><Chapter id={id} className={`chapter-choreography paper-entry ${className}`}>
    <div ref={anchor} className="chapter-entry-anchor" aria-hidden="true" />
    <m.div className="choreographed-surface" initial={entry} animate={surface} aria-hidden="true"
      onUpdate={latest => {
        if (typeof latest.height === 'number') anchor.current?.parentElement.style.setProperty('--paper-edge', `${latest.height + (latest.y || 0)}px`)
      }} />
    <div className="chapter-choreography-content" data-chapter-stage={stage}>
      {children({heading: {initial: hidden, animate: heading}, supporting: {initial: hidden, animate: supporting}, content: {initial: contentHidden, animate: content}})}
    </div>
    <noscript><style>{'.paper-entry .choreographed-surface{height:100%!important;transform:none!important}.paper-entry .chapter-reveal{opacity:1!important;visibility:visible!important;transform:none!important;clip-path:none!important}'}</style></noscript>
  </Chapter></MotionConfig>
}
