import React, {useEffect, useRef} from 'react'
import {useLandingMotion} from './MotionProvider'
import {STREAM_ROW_HEIGHT, STREAM_SETTLE_MS, streamDensity, streamText, rowIsClear} from './data-stream.mjs'

// A gutter-bound illustration, never telemetry. Scroll is its only input.
export default function DataStreamRail() {
  const ref = useRef(null)
  const {ready, reduced} = useLandingMotion()
  useEffect(() => {
    if (!ready || reduced) return
    const eligible = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)')
    const canvas = ref.current
    const context = canvas.getContext('2d')
    if (!context) return
    const root = canvas.closest('.landing-root')
    // Do not paint across product proof, type, controls, or interactive graphics,
    // even when an unusually narrow desktop leaves no gutter beside them.
    const protectedElements = Array.from(root.querySelectorAll('h1,h2,h3,p,dl,ol,.product-media,.install-command,.network-topology,.provider-system,.floating-header,.action-row,.site-button'))
    const chapters = Array.from(root.querySelectorAll('main > section'))
    let blockers = [], density = 5, rect, width = 0, height = 0
    let frame = 0, offset = 0, velocity = 0, lastFrame = 0
    let previousScroll = window.scrollY, lastInput = -Infinity, dirty = true
    const allowed = () => eligible.matches && navigator.maxTouchPoints === 0 && !document.hidden
    const stop = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      velocity = 0
      context.clearRect(0, 0, width, height)
      canvas.dataset.streamState = 'idle'
    }
    const measure = () => {
      rect = canvas.getBoundingClientRect()
      blockers = protectedElements.map(element => element.getBoundingClientRect()).filter(box => box.width && box.height)
      const current = chapters.find(element => {
        const box = element.getBoundingClientRect()
        return box.top <= innerHeight * .55 && box.bottom > innerHeight * .55
      })
      density = streamDensity(current?.id)
      canvas.dataset.density = String(density)
      dirty = false
    }
    const paint = time => {
      frame = 0
      if (!allowed()) {stop(); return}
      if (dirty) measure()
      const dt = Math.min(32, Math.max(1, time - lastFrame))
      lastFrame = time
      const age = time - lastInput
      const moving = age < STREAM_SETTLE_MS
      if (moving) {
        offset += velocity * dt / 16
        velocity *= Math.pow(.86, dt / 16)
      }
      context.clearRect(0, 0, width, height)
      context.font = '11px ui-monospace, monospace'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      const rows = Math.ceil(height / STREAM_ROW_HEIGHT)
      const span = rows * STREAM_ROW_HEIGHT
      for (let row = 0; row < rows; row++) {
        if (row % density !== 0) continue
        const position = row * STREAM_ROW_HEIGHT + offset * (.8 + row % 3 * .12)
        const y = ((position % span) + span) % span
        if (!rowIsClear(y + rect.top, rect.left, blockers)) continue
        const cycle = Math.floor(position / span)
        const mutation = moving && age < 180 && row % 4 === 0 ? 1 + Math.floor(age / 45) : 0
        context.fillStyle = `rgba(170,170,170,${row % 3 === 0 ? .42 : .25})`
        context.fillText(streamText(row, cycle, mutation), width / 2, y)
      }
      canvas.dataset.streamState = moving ? 'scrolling' : 'idle'
      if (moving) frame = window.requestAnimationFrame(paint)
    }
    const wake = () => {
      if (!frame && allowed()) {lastFrame = performance.now(); frame = window.requestAnimationFrame(paint)}
    }
    const resize = () => {
      stop()
      rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      dirty = true
      wake()
    }
    const scroll = () => {
      const delta = window.scrollY - previousScroll
      previousScroll = window.scrollY
      if (!allowed() || !delta) return
      const now = performance.now()
      const speed = Math.min(3, Math.abs(delta) / Math.max(16, now - lastInput))
      offset += delta * .08
      velocity = Math.sign(delta) * (1 + speed * .7)
      lastInput = now
      dirty = true
      wake()
    }
    const visibility = () => {if (document.hidden) stop(); else {dirty = true; wake()}}
    resize()
    eligible.addEventListener('change', resize)
    window.addEventListener('resize', resize, {passive: true})
    window.addEventListener('scroll', scroll, {passive: true})
    document.addEventListener('visibilitychange', visibility)
    return () => {
      stop()
      eligible.removeEventListener('change', resize)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', scroll)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [ready, reduced])
  return <canvas ref={ref} className="data-stream-rail" data-stream-state="idle" aria-hidden="true" />
}
