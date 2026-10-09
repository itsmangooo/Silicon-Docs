import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'
import test from 'node:test'
import {STREAM_GLYPHS, STREAM_TOKENS, STREAM_SETTLE_MS, streamDensity, streamText, rowIsClear} from '../src/components/landing/motion/data-stream.mjs'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('data stream uses only the restricted illustration vocabulary', () => {
  assert.equal(STREAM_GLYPHS, '01ABCDEF/:.-#[]')
  assert.deepEqual(STREAM_TOKENS, ['SHA', 'SSH', 'AWS', 'SSM', 'DNS', 'API', 'TCP', 'WG', '8080'])
  for (let row = 0; row < 48; row++) {
    for (let cycle = -5; cycle <= 5; cycle++) {
      for (let mutation = 0; mutation < 5; mutation++) {
        const value = streamText(row, cycle, mutation)
        assert.equal(value, streamText(row, cycle, mutation), 'Illustration must be deterministic')
        assert.ok(STREAM_TOKENS.includes(value) || [...value].every(char => STREAM_GLYPHS.includes(char)))
        assert.ok(value.length <= 4, 'No long strings or invented telemetry')
      }
    }
  }
  assert.notEqual(streamText(0, 0, 1), streamText(0, 0, 2), 'A brief mutation changes glyphs')
})

test('hero is sparse, technical chapters denser, and motion settles promptly', () => {
  assert.ok(streamDensity('hero') > streamDensity('aws'))
  assert.ok(streamDensity('aws') > streamDensity('network'))
  assert.equal(streamDensity('network'), streamDensity('architecture'))
  assert.equal(streamDensity(undefined), 3)
  assert.ok(STREAM_SETTLE_MS > 0 && STREAM_SETTLE_MS <= 500)
})

test('the rail excludes text and screenshot rows with a safety margin', () => {
  const blockers = [{top: 200, bottom: 500, right: 1395}]
  assert.equal(rowIsClear(300, 1400, blockers), false)
  assert.equal(rowIsClear(189, 1400, blockers), false)
  assert.equal(rowIsClear(511, 1400, blockers), false)
  assert.equal(rowIsClear(100, 1400, blockers), true)
  assert.equal(rowIsClear(300, 1420, blockers), true)
  assert.equal(rowIsClear(300, 1400, []), true)
})

test('one fixed rail responds to scrolling, not the pointer, and respects visibility/preferences', () => {
  const component = read('src/components/landing/motion/DataStreamRail.jsx')
  const styles = read('src/css/landing/data-stream.css')
  const page = read('src/pages/index.jsx')
  assert.equal((page.match(/<DataStreamRail\s*\/>/g) || []).length, 1)
  assert.equal(existsSync(new URL('../src/components/landing/motion/GlobalSignalTrace.jsx', import.meta.url)), false)
  assert.doesNotMatch(component + page, /GlobalSignalTrace|pointermove|mousemove|pointerdown/)
  assert.doesNotMatch(read('src/components/landing/sections/NetworkChapter.jsx') + read('src/css/landing/network-interactions.css'), /reticle|cursor: none/)
  assert.match(component, /addEventListener\('scroll', scroll, \{passive: true\}\)/)
  assert.match(component, /Array.from\(root.querySelectorAll/, 'Convert DOM collections explicitly for the production Babel spread configuration')
  assert.match(component, /if \(moving\) frame = window.requestAnimationFrame\(paint\)/)
  assert.match(component, /if \(!ready \|\| reduced\) return/)
  assert.match(component, /document.hidden/)
  assert.match(component, /removeEventListener\('visibilitychange', visibility\)/)
  assert.match(styles, /position: fixed/)
  assert.match(styles, /pointer-events: none/)
  assert.match(styles, /max-width: 899px/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(component + styles, /shadow|glow|filter:|gradient/)
})

test('paper entrance is bounded and only typography is clipped against the arriving surface', () => {
  const component = read('src/components/landing/motion/PaperChapter.jsx')
  const styles = read('src/css/landing/chapter-choreography.css')
  assert.match(component, /entry = \{height: 200, y: 56\}/)
  assert.match(component, /surface\.set\(\{height: '100%', y: 0\}\)/)
  assert.match(component, /if \(reduced \|\| complete.current\) \{settle\(\); return\}/)
  assert.match(component, /Promise\.all\(/, 'The title must not wait for full surface expansion')
  assert.match(styles, /\.paper-entry \.cloud-title \{clip-path: inset/)
  assert.doesNotMatch(component, /minHeight|min-height|100vh|100svh/)
  assert.match(component, /contentHidden = \{opacity: 0, visibility: 'hidden'\}/, 'Do not transform screenshot content')
  assert.match(component, /<noscript>/)
})
