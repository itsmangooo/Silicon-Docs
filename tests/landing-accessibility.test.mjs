import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import test from 'node:test'

const projectRoot = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, projectRoot), 'utf8')
const tokens = read('src/css/landing/tokens.css')
const styles = read('src/css/landing/landing.css')
const motionStyles = read('src/css/landing/motion.css')

function color(name) {
  const match = tokens.match(new RegExp(`--landing-${name}:\\s*(#[a-f\\d]{6})\\s*;`, 'i'))
  assert.ok(match, `Missing six-digit color token: --landing-${name}`)
  return match[1]
}

function luminance(hex) {
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
  const linear = rgb.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

function blockAfter(source, selector) {
  const selectorIndex = source.indexOf(selector)
  assert.notEqual(selectorIndex, -1, `Missing CSS contract: ${selector}`)
  const start = source.indexOf('{', selectorIndex)
  let depth = 1
  for (let index = start + 1; index < source.length; index++) {
    if (source[index] === '{') depth++
    if (source[index] === '}' && --depth === 0) return source.slice(start + 1, index)
  }
  assert.fail(`Unclosed CSS contract: ${selector}`)
}

function sourceFiles(directory) {
  return readdirSync(new URL(directory, projectRoot), {withFileTypes: true}).flatMap(entry => {
    const path = `${directory}/${entry.name}`
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:js|jsx|css)$/.test(entry.name) ? [path] : []
  })
}

test('landing text and primary actions meet WCAG AA normal-text contrast', context => {
  for (const foreground of ['text', 'muted', 'faint']) {
    const ratio = contrast(color(foreground), color('bg'))
    context.diagnostic(`${foreground} on background: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 4.5, `${foreground} requires 4.5:1; measured ${ratio.toFixed(2)}:1`)
  }
  for (const background of ['accent', 'accent-hover']) {
    const ratio = contrast(color('accent-ink'), color(background))
    context.diagnostic(`primary action text on ${background}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 4.5, `Primary action text requires 4.5:1; measured ${ratio.toFixed(2)}:1`)
  }
})

test('central reduced-motion CSS makes reveal content and diagram paths fully visible', () => {
  // Static source contract only: this does not emulate an OS preference or a browser.
  const reduced = blockAfter(motionStyles, '@media (prefers-reduced-motion: reduce)')
  assert.match(reduced, /animation:\s*none\s*!important/)
  assert.match(reduced, /transition:\s*none\s*!important/)
  assert.match(reduced, /scroll-behavior:\s*auto\s*!important/)
  const reveal = blockAfter(reduced, '.silicon-landing .landing-reveal')
  assert.match(reveal, /opacity:\s*1\s*!important/)
  assert.match(reveal, /transform:\s*none\s*!important/)
  const diagram = blockAfter(reduced, '.silicon-landing .diagram-path')
  assert.match(diagram, /stroke-dasharray:\s*none\s*!important/)
  assert.match(diagram, /stroke-dashoffset:\s*0\s*!important/)
  assert.match(read('src/components/landing/motion/MotionProvider.jsx'), /<MotionConfig\s+reducedMotion="user"/)
})

test('keyboard focus is visible and reveals its containing content', context => {
  const focus = blockAfter(styles, '.silicon-landing :where(a,button,pre):focus-visible')
  assert.match(focus, /outline:\s*[12]px solid var\(--landing-accent\)/)
  assert.match(focus, /outline-offset:\s*[1-9]\d*px/)
  const focusedReveal = blockAfter(motionStyles, '.silicon-landing .landing-reveal:focus-within')
  assert.match(focusedReveal, /opacity:\s*1\s*!important/)
  assert.match(focusedReveal, /transform:\s*none\s*!important/)
  assert.match(blockAfter(styles, '.landing-skip:focus'), /transform:\s*none/)
  for (const background of ['bg', 'surface']) {
    const ratio = contrast(color('accent'), color(background))
    context.diagnostic(`focus indicator on ${background}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 3, `Focus indicator requires 3:1 against ${background}`)
  }
})

test('landing has no permanent animation loop or prohibited scrolling/rendering dependency', () => {
  const files = [...sourceFiles('src/components/landing'), ...sourceFiles('src/css/landing'), 'src/pages/index.jsx']
  for (const file of files) {
    const source = read(file)
    assert.doesNotMatch(source, /\brequestAnimationFrame\s*\(|@(?:-\w+-)?keyframes\b|\brepeat\s*:\s*Infinity\b|\banimation[^;{}]*\binfinite\b/, `${file}: native scrolling and finite motion must remain authoritative`)
    assert.doesNotMatch(source, /(?:from\s*|import\s*\(|require\s*\()\s*['"](?:gsap|lenis|@studio-freight\/lenis|three|@react-three\/fiber|playcanvas|lottie-web)(?:\/[^'"]*)?['"]/, `${file}: prohibited motion/rendering dependency`)
  }
  const manifest = JSON.parse(read('package.json'))
  const dependencyNames = Object.keys({...manifest.dependencies, ...manifest.devDependencies})
  for (const name of dependencyNames) {
    assert.doesNotMatch(name, /^(?:gsap|lenis|@studio-freight\/lenis|three|@react-three\/fiber|playcanvas|lottie-web)$/, `Prohibited landing dependency: ${name}`)
  }
})
