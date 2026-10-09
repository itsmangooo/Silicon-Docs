import React, {useEffect, useRef} from 'react'
import {useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import {decodedFrame, DECODE_FRAMES, DECODE_FRAME_MS} from './decode.mjs'

export default function DecodeText({text, children, active = true, className = ''}) {
  const finalText = String(text ?? children ?? '')
  const ref = useRef(null)
  const visual = useRef(null)
  const completed = useRef(null)
  const {ready, reduced} = useLandingMotion()
  const inView = useInView(ref, {once: true, amount: .5})

  useEffect(() => {
    const label = visual.current
    label.textContent = finalText
    if (!ready || reduced || finalText.length > 32 || !active || !inView || completed.current === finalText) return
    let frame = 0
    // Only the aria-hidden animation layer changes; accessible text is stable.
    // Keep per-frame work outside React's rendering of the surrounding story.
    label.textContent = decodedFrame(finalText, frame)
    const timer = window.setInterval(() => {
      frame += 1
      label.textContent = decodedFrame(finalText, frame)
      if (frame >= DECODE_FRAMES) {
        completed.current = finalText
        window.clearInterval(timer)
        label.textContent = finalText
      }
    }, DECODE_FRAME_MS)
    return () => {window.clearInterval(timer); label.textContent = finalText}
  }, [active, finalText, inView, ready, reduced])

  return <span ref={ref} className={`decode-text ${className}`}>
    <span className="sr-only">{finalText}</span>
    <span className="decode-text__final" aria-hidden="true">{finalText}</span>
    <span ref={visual} className="decode-text__visual" aria-hidden="true">{finalText}</span>
  </span>
}
