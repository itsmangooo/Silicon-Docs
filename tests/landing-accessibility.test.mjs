import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import test from 'node:test'
import {siliconTheme} from '../src/landing/silicon/theme.mjs'

const projectRoot = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, projectRoot), 'utf8')
const styles = sourceFiles('src/css/landing').map(read).join('\n')

function color(name, backdrop = 'site-bg') {
  const value = siliconTheme[`--${name}`]
  if (/^#[a-f\d]{6}$/i.test(value)) return value
  const translucent = value?.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0?\.\d+|1(?:\.0+)?)\s*\)$/i)
  assert.ok(translucent, `Missing supported hex/RGBA theme color: --${name}`)
  const background = color(backdrop)
  const alpha = Number(translucent[4])
  return `#${[1, 2, 3].map((index, channel) => {
    const lower = parseInt(background.slice(1 + channel * 2, 3 + channel * 2), 16)
    return Math.round(Number(translucent[index]) * alpha + lower * (1 - alpha)).toString(16).padStart(2, '0')
  }).join('')}`
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

function declarationsFor(source, selector) {
  return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) => selectors.split(',').some(value => value.trim() === selector))
    .map(([, , declarations]) => declarations).join('\n')
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
    ['foreground', 'surface-raised'], ['muted', 'surface-raised'],
    ['foreground', 'glass-bg'], ['muted', 'glass-bg'],
    ['foreground', 'glass-bg-strong'], ['muted', 'glass-bg-strong'],
    ['ink', 'paper'], ['ink-muted', 'paper'], ['ink', 'paper-soft'], ['ink-muted', 'paper-soft'],
    ['ink', 'brand'], ['ink-muted', 'brand'],
  ]) {
    const ratio = contrast(color(foreground), color(background))
    context.diagnostic(`${foreground} on ${background}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= 4.5, `${foreground} on ${background} requires 4.5:1; measured ${ratio.toFixed(2)}:1`)
  }
})

test('internal OS reduced-motion support protects entrances and the scroll story', () => {
  // Static source contracts only; browser checks are still needed to exercise
  // actual preference changes, focus movement, and native scroll behavior.
  const reduced = blockAfter(read('src/css/landing/motion.css'), '@media (prefers-reduced-motion: reduce)')
  assert.match(reduced, /animation:\s*none\s*!important/)
  assert.match(reduced, /transition(?:-duration)?:\s*(?:none|0s)\s*!important/)
  assert.match(reduced, /scroll-behavior:\s*auto\s*!important/)
  const provider = read('src/components/landing/motion/MotionProvider.jsx')
  assert.match(provider, /useReducedMotion\(/)
  assert.match(provider, /matchMedia\(['"]\(prefers-reduced-motion: reduce\)['"]\)/)
  const systemPreference = provider.match(/const\s+(\w+)\s*=\s*Boolean\(\s*systemReduced\s*\?\?\s*osReduced\s*\)/)?.[1]
  assert.ok(systemPreference, 'Normalize the browser preference with the Motion fallback')
  const reduction = [...provider.matchAll(/const\s+reduced\s*=\s*([^\r\n]+)/g)]
    .map(match => match[1]).find(expression => expression.includes(systemPreference))
  assert.ok(reduction?.includes('!settings.ready'), 'Server rendering should start with static content')
  assert.ok(reduction.includes(systemPreference), 'The operating-system preference must reduce motion even without a visible toggle')
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
  const terminal = blockAfter(read('src/css/landing/chapter-choreography.css'), '.install-command {')
  const terminalBackground = terminal.match(/background:\s*(#[a-f\d]{6})/i)?.[1]
  assert.ok(terminalBackground, 'The command surface has a solid dark background')
  assert.ok(contrast(color('brand'), terminalBackground) >= 3)
})

test('major surfaces remain charcoal or paper while selected overlays use restrained glass', () => {
  assert.equal(Object.hasOwn(siliconTheme, '--chapter-green'), false)
  for (const surface of ['site-bg', 'surface', 'surface-raised', 'chapter-graphite', 'network-bg', 'paper', 'paper-soft']) {
    const hex = color(surface)
    const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16))
    assert.ok(Math.max(...channels) - Math.min(...channels) <= 12, `${surface}: do not use green-tinted chapter fills; reserve mint for small accents`)
  }
  const nav = declarationsFor(styles, '.floating-nav')
  assert.match(nav, /background:\s*var\(--nav-bg\)/)
  assert.match(siliconTheme['--nav-bg'], /^rgba\(/, 'Glass navigation needs an actually translucent material')
  assert.match(nav, /(?:-webkit-)?backdrop-filter:\s*blur\((?:[1-9]|[12]\d)px\)/, 'Glass needs a restrained real backdrop blur')
  assert.doesNotMatch(blockAfter(styles, '.landing-root {'), /backdrop-filter/, 'Do not blur the entire application surface')
  assert.doesNotMatch(blockAfter(styles, '.chapter {'), /backdrop-filter/, 'Glass should be selective rather than applied to every chapter')
  assert.ok(contrast(color('foreground'), color('nav-bg', 'paper')) >= 4.5, 'Navigation must remain readable when a light chapter passes behind it')
})

test('product proof stays stable, accessible, and in its original colors', () => {
  const media = read('src/components/landing/core/MediaFrame.jsx')
  assert.match(media, /<img\b/)
  assert.match(media, /alt=\{image\.alt\}/)
  assert.match(media, /width=\{image\.width\}/)
  assert.match(media, /height=\{image\.height\}/)
  assert.match(media, /loading=\{eager \? 'eager' : 'lazy'\}/)
  assert.match(media, /<a\b[^>]*href=\{src\}/, 'Full-resolution product proof remains reachable')
  assert.doesNotMatch(media, /View full capture|<figcaption|MediaReveal|animate=|clipPath|rotate|scale:/, 'Screenshot pixels and geometry remain stable')
  for (const [, selectors, declarations] of styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const imageRule = selectors.split(',').some(selector => /(?:^|\s)\.(?:product-media|hero-proof|poster-proof|servers-proof|cloud-proof)\s+img(?:\b|$)/.test(selector.trim()))
    if (!imageRule) continue
    assert.doesNotMatch(declarations, /(?:^|;)\s*(?:filter|mix-blend-mode|transform|clip-path)\s*:/, `${selectors.trim()}: preserve the original product proof`)
  }
})

test('landing has no permanent animation loop or prohibited scrolling/rendering dependency', () => {
  const files = [...sourceFiles('src/components/landing'), ...sourceFiles('src/css/landing'), ...sourceFiles('src/landing'), 'src/pages/index.jsx']
  for (const file of files) {
    const source = read(file)
    assert.doesNotMatch(source, /\brepeat\s*:\s*Infinity\b|\banimation[^;{}]*\binfinite\b/, `${file}: native scrolling and finite motion must remain authoritative`)
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
