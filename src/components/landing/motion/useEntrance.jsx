import {useRef} from 'react'
import {useAnimationControls, useIsomorphicLayoutEffect} from 'motion/react'
import {useLandingMotion} from './MotionProvider'

// Static markup stays readable. Once the browser opts into full motion, seed
// the entrance before paint even when IntersectionObserver already saw it.
export default function useEntrance({full, inView, from, to, transition}) {
  const controls = useAnimationControls()
  const {ease} = useLandingMotion()
  const mode = useRef(false)
  const revealed = useRef(false)
  const values = useRef({from, to, transition})
  values.current = {from, to, transition: {ease, ...transition}}
  const startGeometry = JSON.stringify(from)
  const finalGeometry = JSON.stringify(to)

  useIsomorphicLayoutEffect(() => {
    const current = values.current
    if (!full) {
      controls.stop()
      controls.set(current.to)
      mode.current = false
      revealed.current = false
      return
    }
    if (!mode.current || !revealed.current) {
      controls.set(current.from)
      mode.current = true
    }
    if (inView && !revealed.current) {
      revealed.current = true
      controls.start(current.to, current.transition)
    } else if (revealed.current) {
      controls.set(current.to)
    }
  }, [controls, full, inView, startGeometry, finalGeometry])

  return controls
}
