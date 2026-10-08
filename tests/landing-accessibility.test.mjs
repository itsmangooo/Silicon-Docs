import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import test from 'node:test'
import {siliconTheme} from '../src/landing/silicon/theme.mjs'

const projectRoot = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, projectRoot), 'utf8')
const styles = sourceFiles('src/css/landing').map(read).join('\n')

function color(name) {
  const value = siliconTheme[`--${name}`]
  assert.match(value, /^#[a-f\d]{6}$/i, `Missing six-digit theme color: --${name}`)
  return value
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
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:mjs|js|jsx|css)$/.test(entry.name) ? [path] : []
  })
}

test('landing text and primary actions meet WCAG AA normal-text contrast', context => {
  for (const [foreground, background] of [
    ['foreground', 'site-bg'], ['muted', 'site-bg'], ['muted', 'surface'],
    ['foreground', 'chapter-graphite'], ['muted', 'chapter-graphite'],
    ['foreground', 'network-bg'], ['muted', 'network-bg'],
    ['foreground', 'nav-bg'], ['muted', 'nav-bg'],
    ['ink', 'paper'], ['ink-muted', 'paper'], ['ink', 'paper-soft'], ['ink-muted', 'paper-soft'],
    ['ink', 'brand'], ['ink-muted', 'brand'],
  ]) {
    const ratio = contrast(color(foreground), color(background))
    context.diagnostic(`${foreground} on ${background}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 4.5, `${foreground} on ${background} requires 4.5:1; measured ${ratio.toFixed(2)}:1`)
  }
})

test('OS and manual reduced-motion preferences protect entrances and the scroll story', () => {
  // Static source contracts only; browser checks are still needed to exercise
  // actual preference changes, focus movement, and native scroll behavior.
  const reduced = blockAfter(styles, '@media (prefers-reduced-motion: reduce)')
  assert.match(reduced, /animation:\s*none\s*!important/)
  assert.match(reduced, /transition(?:-duration)?:\s*(?:none|0s)\s*!important/)
  assert.match(reduced, /scroll-behavior:\s*auto\s*!important/)
  const provider = read('src/components/landing/motion/MotionProvider.jsx')
  assert.match(provider, /useReducedMotion\(/)
  assert.match(provider, /matchMedia\(['"]\(prefers-reduced-motion: reduce\)['"]\)/)
  assert.match(provider, /localStorage\.setItem\(preferenceKey, reduced \? 'reduced' : 'full'\)/)
  const systemPreference = provider.match(/const\s+(\w+)\s*=\s*Boolean\(\s*systemReduced\s*\?\?\s*osReduced\s*\)/)?.[1]
  assert.ok(systemPreference, 'Normalize the browser preference with the Motion fallback')
  const reduction = [...provider.matchAll(/const\s+reduced\s*=\s*([^\r\n]+)/g)]
    .map(match => match[1]).find(expression => expression.includes(systemPreference))
  assert.ok(reduction?.includes('!settings.ready'), 'Server rendering should start with static content')
  assert.match(reduction, new RegExp(`\\b${systemPreference}\\b\\s*\\|\\|\\s*manualReduced`), 'Either OS or manual preference must reduce motion')
  assert.match(provider, /reducedMotion=\{reduced \? 'always' : 'user'\}/)
  const story = read('src/components/landing/motion/ScrollScene.jsx')
  assert.match(story, /!ready \|\| reduced \|\| !desktopStory/)
  assert.match(story, /isStatic \? stageCount - 1/, 'Static presentation must show the complete final topology')
  assert.ok(Number(siliconTheme['--story-min-width']) >= 1100)
  assert.ok(Number(siliconTheme['--story-min-height']) >= 700)
})

test('keyboard focus and the skip link remain visible across chapter surfaces', context => {
  const focus = blockAfter(styles, ':focus-visible')
  assert.match(focus, /outline:\s*[12]px solid var\(--brand\)/)
  assert.match(focus, /outline-offset:\s*[1-9]\d*px/)
  assert.match(blockAfter(styles, '.landing-skip:focus'), /top:\s*\d+px/)
  const focusedActions = blockAfter(styles, '.supporting-reveal:focus-within')
  assert.match(focusedActions, /opacity:\s*1\s*!important/)
  assert.match(focusedActions, /transform:\s*none\s*!important/)
  for (const background of ['site-bg', 'surface', 'chapter-graphite', 'network-bg', 'nav-bg']) {
    const ratio = contrast(color('brand'), color(background))
    context.diagnostic(`focus indicator on ${background}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 3, `Focus indicator requires 3:1 against ${background}`)
  }
  if (/\.chapter--paper\s*\{[^}]*background:\s*var\(--paper\)/.test(styles)) {
    assert.match(styles, /\.chapter--paper[^{}]*:focus-visible[^{}]*\{[^}]*outline-color:\s*var\(--ink\)/)
  }
  for (const background of ['paper', 'paper-soft', 'brand']) {
    const ratio = contrast(color('ink'), color(background))
    context.diagnostic(`focus indicator on ${background}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 3, `Focus indicator requires 3:1 against ${background}`)
  }
  if (styles.includes('.install-command :focus-visible')) {
    const terminalFocus = blockAfter(styles, '.install-command :focus-visible')
    assert.match(terminalFocus, /outline-color:\s*var\(--brand\)/, 'Dark terminals should use the dark-surface focus color')
  }
  const terminal = blockAfter(styles, '.install-command {')
  assert.match(terminal, /background:\s*var\(--site-bg\)/)
  assert.ok(contrast(color('brand'), color('site-bg')) >= 3)
})

test('landing colors remain neutral and solid surfaces have no glass treatment', () => {
  assert.doesNotMatch(styles, /\b(?:-webkit-)?backdrop-filter\b/i, 'Do not use blurred or frosted surfaces')
  assert.equal(Object.hasOwn(siliconTheme, '--glass-bg'), false)
  assert.equal(Object.hasOwn(siliconTheme, '--chapter-green'), false)
  const colors = Object.values(siliconTheme).filter(value => /^#[a-f\d]{6}$/i.test(value))
  for (const hex of colors) {
    const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16))
    assert.ok(Math.max(...channels) - Math.min(...channels) <= 12, `${hex}: keep the landing palette near neutral; screenshots retain their own product colors`)
  }
  const nav = blockAfter(styles, '.floating-nav {')
  assert.match(nav, /background:\s*var\(--nav-bg\)/, 'Floating navigation should use its solid neutral surface')
})

test('product screenshots and their enclosing stages stay completely static', () => {
  const media = read('src/components/landing/core/MediaFrame.jsx')
  const hero = read('src/components/landing/compositions/HeroMediaStage.jsx')
  assert.doesNotMatch(media, /MediaReveal|useEntrance|useScroll|useTransform|<(?:m|motion)\./)
  assert.match(media, /return\s*<figure\b/)
  assert.match(media, /<img\b/)
  assert.match(hero, /return\s*<div\b/, 'The hero screenshot stage must be an ordinary element')
  assert.doesNotMatch(hero, /useScroll|useTransform|style=\{|return\s*<(?:m|motion)\./, 'Animate separate structural elements, not the screenshot container')
  const compositions = read('src/components/landing/compositions/Chapter.jsx')
  const frame = compositions.slice(compositions.indexOf('export function CurvedStage'), compositions.indexOf('export function FactRail'))
  assert.match(frame, /return\s*<div\b/)
  assert.doesNotMatch(frame, /<MacroReveal\b[^>]*(?<!\/)>(?:\s*)\{children\}/, 'Frame motion must be separate from screenshot children')

  for (const [, selectors, declarations] of styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const screenshotRule = selectors.split(',').some(selector => /(?:^|\s)\.(?:product-media(?:--[\w-]+)?(?:__link)?(?:\s+img)?|hero-media-stage|hero-proof|poster-proof|servers-proof|cloud-proof|curved-stage|servers-frame|hero-chapter|poster-chapter|servers-chapter|cloud-chapter)(?::[\w-]+)?$/.test(selector.trim()))
    if (!screenshotRule) continue
    assert.doesNotMatch(declarations, /(?:^|;)\s*(?:transform|perspective|clip-path|mask(?:-image)?|filter|animation(?:-name)?)\s*:/, `${selectors.trim()}: screenshot pixels and containers must not reveal, move, mask, or recolor`)
  }
})

test('landing has no permanent animation loop or prohibited scrolling/rendering dependency', () => {
  const files = [...sourceFiles('src/components/landing'), ...sourceFiles('src/css/landing'), ...sourceFiles('src/landing'), 'src/pages/index.jsx']
  for (const file of files) {
    const source = read(file)
    assert.doesNotMatch(source, /\brequestAnimationFrame\s*\(|\brepeat\s*:\s*Infinity\b|\banimation[^;{}]*\binfinite\b/, `${file}: native scrolling and finite motion must remain authoritative`)
    assert.doesNotMatch(source, /(?:from\s*|import\s*\(|require\s*\()\s*['"](?:lenis|@studio-freight\/lenis|three|@react-three\/fiber|playcanvas|lottie-web)(?:\/[^'"]*)?['"]/, `${file}: prohibited motion/rendering dependency`)
  }
  const manifest = JSON.parse(read('package.json'))
  const dependencyNames = Object.keys({...manifest.dependencies, ...manifest.devDependencies})
  for (const name of dependencyNames) {
    assert.doesNotMatch(name, /^(?:lenis|@studio-freight\/lenis|three|@react-three\/fiber|playcanvas|lottie-web)$/, `Prohibited landing dependency: ${name}`)
  }
})

test('the landing remains independent from Markdown content and Silicon runtime APIs', () => {
  const files = [...sourceFiles('src/components/landing'), ...sourceFiles('src/landing'), 'src/pages/index.jsx']
  for (const file of files) {
    const source = read(file)
    assert.doesNotMatch(source, /(?:from\s*|import\s*\(|require\s*\()\s*['"][^'"]*(?:\/docs\/|\/frontend\/|\/backend\/)/, `${file}: use links to docs instead of importing another application`)
    assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/, `${file}: static product pages must not require Silicon runtime APIs`)
  }
})
