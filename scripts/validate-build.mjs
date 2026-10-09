import assert from 'node:assert/strict'
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs'
import {join, resolve, sep} from 'node:path'
import {silicon} from '../src/landing/silicon/content.mjs'

const build = resolve(process.env.DOCS_BUILD_DIR || 'build')
const baseUrl = process.env.DOCS_BASE_URL || '/Silicon-Docs/'
const siteUrl = process.env.DOCS_URL || 'https://itsmangooo.github.io'
const failures = []
let references = 0
let redirects = 0

function files(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)])
}
function outputExists(pathname) {
  const relative = decodeURIComponent(pathname.slice(baseUrl.length))
  return [relative, `${relative}.html`, join(relative, 'index.html')].some(name => {
    const target = resolve(build, name)
    return target.startsWith(`${build}${sep}`) && existsSync(target) && statSync(target).isFile()
  })
}

assert.ok(existsSync(join(build, 'index.html')), 'Run docs:build first')
const pages = files(build).filter(path => path.endsWith('.html'))
for (const page of pages) {
  const html = readFileSync(page, 'utf8')
  const relative = page.slice(build.length + 1).replaceAll('\\', '/')
  const currentUrl = new URL(`${baseUrl}${relative}`, siteUrl)
  // Static HTML is the deployment contract. Validate emitted links, not just
  // source strings, so useBaseUrl and redirects are covered by the same check.
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&')
    if (/^(?:#|mailto:|tel:|data:|javascript:)/.test(value)) continue
    const url = new URL(value, currentUrl)
    if (url.origin !== new URL(siteUrl).origin) continue
    references++
    if (!url.pathname.startsWith(baseUrl)) failures.push(`${relative}: escaped baseUrl: ${value}`)
    else if (!outputExists(url.pathname)) failures.push(`${relative}: missing target: ${value}`)
  }
  if (relative.startsWith('docs/') && !['docs/index.html', 'docs.html'].includes(relative)) {
    const route = relative.replace(/(?:\/index)?\.html$/, '')
    const legacy = route.slice('docs/'.length)
    // Client redirects deliberately use directory indexes, even when the
    // target documentation uses Docusaurus's extensionless HTML routes.
    const redirectPath = join(build, legacy, 'index.html')
    if (!existsSync(redirectPath)) failures.push(`Missing old docs redirect: ${legacy}`)
    else {
      const alias = readFileSync(redirectPath, 'utf8')
      if (!alias.includes(`${baseUrl}${route}`)) failures.push(`Incorrect redirect: ${legacy}`)
      redirects++
    }
  }
}
const home = readFileSync(join(build, 'index.html'), 'utf8')
// A font mentioned only by an inline custom property can be incorrectly pruned
// by production CSS optimization. Check emitted faces, not just source imports.
const builtCSS = files(join(build, 'assets', 'css')).filter(path => path.endsWith('.css')).map(path => readFileSync(path, 'utf8')).join('\n')
for (const weight of [400, 500, 600]) {
  assert.ok([...builtCSS.matchAll(/@font-face\s*\{([^}]+)\}/g)].some(([, rule]) =>
    /font-family:\s*["']?Poppins/i.test(rule) && new RegExp(`font-weight:\\s*${weight}(?:;|$)`).test(rule)),
  `Production output must retain the self-hosted Poppins ${weight} face`)
}
const h1 = home.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]*>/g, ' ').trim()
assert.ok(h1?.length > 15, 'Public landing needs a substantive semantic page heading')
assert.equal([...home.matchAll(/<h1\b/gi)].length, 1, 'Public landing needs one primary heading')
for (const id of silicon.chapterOrder) {
  assert.ok(home.includes(`id="${id}"`), `Landing chapter ${id} is missing`)
}
assert.doesNotMatch(home, /\bclass="[^"]*\bchapter-label\b/, 'Use semantic headings instead of tiny section eyebrows')
assert.doesNotMatch(home, /Product reference:|Reduce motion|View full capture/, 'Do not render inspection-style labels or decorative accessibility controls')
const diagrams = new Set([...home.matchAll(/\bdata-diagram="([^"]+)"/g)].map(match => match[1]))
assert.ok(diagrams.size >= 3, 'Landing needs at least three distinct explanatory graphics')
assert.ok(diagrams.has('provider-architecture'), 'Landing needs the implemented provider architecture graphic')
const providerGraph = home.match(/<svg\b[^>]*class="[^"]*\bprovider-system__desktop\b[^"]*"[^>]*>([\s\S]*?)<\/svg>/i)
assert.ok(providerGraph, 'Desktop provider architecture should be a coordinated SVG')
assert.match(providerGraph[0], /\brole="img"/, 'Provider graphic needs semantic image treatment')
assert.match(providerGraph[0], /\baria-labelledby="[^"]+"/, 'Provider graphic needs an accessible name and description')
assert.match(providerGraph[1], /<title\b[^>]*>[^<]+<\/title>/)
assert.match(providerGraph[1], /<desc\b[^>]*>[^<]+<\/desc>/)
assert.equal([...providerGraph[1].matchAll(/\bclass="[^"]*\bprovider-system__node-shape\b[^"]*"/g)].length, silicon.architecture.providers.length, 'Every implemented provider needs one desktop node')
const compactProviders = [...home.matchAll(/<div\b[^>]*class="[^"]*\bprovider-system__compact-node\b[^"]*"[^>]*>([\s\S]*?)<\/div>/g)]
assert.equal(compactProviders.length, silicon.architecture.providers.length, 'Compact architecture should retain every implemented provider')
for (const [, node] of compactProviders) {
  assert.match(node, /<dt\b[^>]*>[^<]+<\/dt>/, 'Compact provider needs a semantic category')
  assert.match(node, /<dd\b[^>]*>[^<]+<\/dd>/, 'Compact provider needs implementation detail')
}
assert.ok(home.includes(`${baseUrl}docs/`), 'Landing docs links must honor baseUrl')
const productImages = [...home.matchAll(/<img\b[^>]*>/gi)].map(match => match[0])
  .filter(image => image.includes('/img/screenshots/'))
assert.ok(productImages.length > 0, 'Landing needs product screenshots')
for (const [index, image] of productImages.entries()) {
  assert.match(image, /\bwidth="[1-9]\d*"/, 'Product image needs intrinsic width')
  assert.match(image, /\bheight="[1-9]\d*"/, 'Product image needs intrinsic height')
  assert.match(image, /\balt="[^"]+"/, 'Product image needs descriptive alternative text')
  assert.match(image, /\balt="[^"]*sanitized[^"]*"/i, 'Product proof must identify demo fixtures without capture-tool annotations')
  assert.doesNotMatch(image, /\bstyle="[^"]*(?:filter|mix-blend-mode|transform|perspective|clip-path|mask|animation)\s*:/i, 'Product proof must preserve the actual interface colors and stable geometry')
  if (index === 0) assert.ok(!image.includes('loading="lazy"'), 'Hero should load without waiting for scrolling')
  else assert.ok(image.includes('loading="lazy"'), 'Below-the-fold product images must lazy load')
}
assert.ok(home.includes('property="og:title" content="Silicon'), 'Landing needs social title metadata')
assert.ok(redirects > 40, 'Expected all existing documentation redirects')
assert.deepEqual(failures, [], `${failures.length} generated link/redirect failures`)
console.log(`Validated ${pages.length} HTML pages, ${references} local references, and ${redirects} legacy redirects at ${baseUrl}`)
