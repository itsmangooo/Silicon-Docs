import React, {useEffect, useRef, useState} from 'react'
import {m, useAnimationControls, useInView} from 'motion/react'
import Chapter from '../compositions/Chapter'
import {useLandingMotion} from './MotionProvider'

const hidden = {opacity: 0, visibility: 'hidden', y: 24}
const shown = {opacity: 1, visibility: 'visible', y: 0}
const concealedContent = {opacity: 0, visibility: 'hidden'}
const visibleContent = {opacity: 1, visibility: 'visible'}
const surfaceStart = {y: 96, clipPath: 'inset(38% 0% 0% 0% round 32px)'}
const surfaceEnd = {y: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)'}

// Surface and typography share one timeline. The heading is not allowed to
// become visible until the rising surface covers its entire final position.
export default function ChoreographedChapter({id, className, children}) {
  const anchor = useRef(null)
  const inView = useInView(anchor, {once: true, amount: 0.015, margin: '0px 0px -10% 0px'})
  const {ready, reduced, duration, ease} = useLandingMotion()
  const surface = useAnimationControls()
  const heading = useAnimationControls()
  const supporting = useAnimationControls()
  const content = useAnimationControls()
  const [stage, setStage] = useState('pending')

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const controls = [surface, heading, supporting, content]
    if (reduced) {
      controls.forEach(control => control.stop())
      surface.set(surfaceEnd)
      heading.set(shown)
      supporting.set(shown)
      content.set(visibleContent)
      setStage('complete')
      return
    }
    if (!inView) return
    async function reveal() {
      setStage('surface')
      await surface.start(surfaceEnd, {duration: duration * 1.15, ease})
      if (cancelled) return
      setStage('heading')
      heading.set({visibility: 'visible'})
      const titleReveal = heading.start(shown, {duration: duration * .6, ease})
      // The supporting copy and stable media follow the heading. No scale,
      // perspective, clipping or translation is applied to product captures.
      supporting.set({visibility: 'visible'})
      const copyReveal = supporting.start(shown, {duration: duration * .6, delay: .14, ease})
      content.set({visibility: 'visible'})
      const contentReveal = content.start(visibleContent, {duration: duration * .55, delay: .3, ease})
      await Promise.all([titleReveal, copyReveal, contentReveal])
      if (!cancelled) setStage('complete')
    }
    reveal()
    return () => {
      cancelled = true
      controls.forEach(control => control.stop())
    }
  }, [ready, reduced, inView, duration, ease, surface, heading, supporting, content])

  return <Chapter id={id} className={`chapter-choreography ${className}`}>
    <div ref={anchor} className="chapter-entry-anchor" aria-hidden="true" />
    <m.div className="choreographed-surface" initial={surfaceStart} animate={surface} aria-hidden="true" />
    <div className="chapter-choreography-content" data-chapter-stage={stage}>
      {children({heading: {initial: hidden, animate: heading}, supporting: {initial: hidden, animate: supporting}, content: {initial: concealedContent, animate: content}})}
    </div>
    <noscript><style>{'.chapter-choreography .choreographed-surface{transform:none!important;clip-path:none!important}.chapter-choreography .chapter-reveal{opacity:1!important;visibility:visible!important;transform:none!important}'}</style></noscript>
  </Chapter>
}
