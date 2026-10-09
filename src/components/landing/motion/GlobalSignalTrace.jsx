import React, {useEffect, useRef} from 'react'
import {useLandingMotion} from './MotionProvider'

const TRACE_LIFETIME = 420
const MAX_POINTS = 36

export default function GlobalSignalTrace() {
  const ref = useRef(null)
  const {ready, reduced} = useLandingMotion()

  useEffect(() => {
    if (!ready || reduced) return
    const eligible = window.matchMedia('(min-width: 1100px) and (hover: hover) and (pointer: fine)')
    if (navigator.maxTouchPoints > 0) return
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!context) return
    let points = []
    let frame = 0
    let width = 0
    let height = 0
    let lastPointer = null
    let lastScroll = window.scrollY
    let scrollPosition = window.innerHeight * .5

    const stop = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      points = []
      lastPointer = null
      context.clearRect(0, 0, width, height)
      canvas.dataset.traceState = 'idle'
    }
    const resize = () => {
      stop()
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      scrollPosition = height * .5
    }
    const paint = time => {
      frame = 0
      points = points.filter(point => time - point.time < TRACE_LIFETIME)
      context.clearRect(0, 0, width, height)
      context.lineCap = 'round'
      context.lineWidth = .8
      for (const point of points) {
        const alpha = (1 - (time - point.time) / TRACE_LIFETIME) * .21
        context.strokeStyle = `rgba(218, 220, 220, ${alpha})`
        context.beginPath()
        context.moveTo(point.fromX, point.fromY)
        context.lineTo(point.x, point.y)
        context.stroke()
      }
      // An input event wakes the loop; the final faded point stops it entirely.
      if (points.length) frame = window.requestAnimationFrame(paint)
      else canvas.dataset.traceState = 'idle'
    }
    const add = (fromX, fromY, x, y) => {
      if (!eligible.matches || document.hidden) return
      points.push({fromX, fromY, x, y, time: performance.now()})
      if (points.length > MAX_POINTS) points.shift()
      canvas.dataset.traceState = 'active'
      if (!frame) frame = window.requestAnimationFrame(paint)
    }
    const pointer = event => {
      if (event.pointerType !== 'mouse' || !eligible.matches) return
      const next = {x: event.clientX, y: event.clientY, time: performance.now()}
      if (lastPointer && next.time - lastPointer.time < 120 && Math.hypot(next.x - lastPointer.x, next.y - lastPointer.y) < 160) {
        add(lastPointer.x, lastPointer.y, next.x, next.y)
      }
      lastPointer = next
    }
    const scroll = () => {
      const delta = window.scrollY - lastScroll
      lastScroll = window.scrollY
      if (Math.abs(delta) < 1) return
      const previous = scrollPosition
      scrollPosition = Math.max(height * .25, Math.min(height * .75, previous + Math.sign(delta) * Math.min(Math.abs(delta) * .12, 18)))
      if (scrollPosition === previous) scrollPosition = height * .5
      if (Math.abs(previous - scrollPosition) < 30) add(width - 24, previous, width - 24, scrollPosition)
    }
    const visibility = () => { if (document.hidden) stop() }
    resize()
    eligible.addEventListener('change', stop)
    window.addEventListener('pointermove', pointer, {passive: true})
    window.addEventListener('scroll', scroll, {passive: true})
    window.addEventListener('resize', resize, {passive: true})
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      stop()
      eligible.removeEventListener('change', stop)
      window.removeEventListener('pointermove', pointer)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', resize)
      window.removeEventListener('blur', stop)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [ready, reduced])

  return <canvas ref={ref} className="global-signal-trace" data-trace-state="idle" aria-hidden="true" />
}
