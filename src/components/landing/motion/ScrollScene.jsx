import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useInView, useMotionValueEvent, useScroll} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import {stageCountFor, stageFromProgress} from './settings.mjs'

export default function ScrollScene({children, className = '', stages = 4}) {
  const ref = useRef(null)
  const {ready, reduced, desktopStory} = useLandingMotion()
  const {scrollYProgress} = useScroll({target: ref, offset: ['start start', 'end end']})
  const inView = useInView(ref)
  const [scrollStage, setScrollStage] = useState(0)
  const latestStage = useRef(0)
  const isStatic = !ready || reduced || !desktopStory
  const stageCount = stageCountFor(stages)
  const updateStage = useCallback(value => {
    const nextStage = stageFromProgress(value, stageCount)
    if (nextStage !== latestStage.current) {
      latestStage.current = nextStage
      setScrollStage(nextStage)
    }
  }, [stageCount])
  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (!isStatic) updateStage(value)
  })
  useEffect(() => {
    if (!isStatic) updateStage(scrollYProgress.get())
  }, [isStatic, scrollYProgress, updateStage])
  const stage = isStatic ? stageCount - 1 : Math.min(stageCount - 1, scrollStage)
  const active = !isStatic && inView

  return <section ref={ref} className={`scroll-scene ${isStatic ? 'is-static' : 'is-active'} ${className}`}>
    {children({stage, progress: isStatic ? 1 : stage / stageCount, active, isStatic})}
  </section>
}
