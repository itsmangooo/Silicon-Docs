import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'
import test from 'node:test'
import {silicon} from '../src/landing/silicon/content.mjs'

const projectRoot = new URL('../', import.meta.url)
const readProjectFile = path => readFileSync(new URL(path, projectRoot), 'utf8')

function collectObjects(value, predicate) {
  if (value === null || typeof value !== 'object') return []
  return [
    ...(predicate(value) ? [value] : []),
    ...Object.values(value).flatMap(child => collectObjects(child, predicate)),
  ]
}

test('product screenshots exist with their real PNG dimensions and useful alt text', () => {
  const images = collectObjects(silicon, value => value.src?.startsWith('/img/screenshots/'))
  assert.ok(images.length > 0, 'The landing must show real product proof')

  for (const image of images) {
    const asset = new URL(`static${image.src}`, projectRoot)
    assert.ok(existsSync(asset), `Missing screenshot: ${image.src}`)
    const png = readFileSync(asset)
    assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], image.src)
    assert.equal(png.toString('ascii', 12, 16), 'IHDR', image.src)
    assert.equal(image.width, png.readUInt32BE(16), `${image.src}: incorrect intrinsic width`)
    assert.equal(image.height, png.readUInt32BE(20), `${image.src}: incorrect intrinsic height`)
    assert.ok(image.alt.length >= 40, `${image.src}: explain the product screen in alt text`)
    assert.match(image.alt, /sanitized/i, `${image.src}: keep demo context explicit`)
  }
})

test('the eight editorial chapters have unique anchors and substantive content', () => {
  // A content contract, independent of the components or composition used to
  // present each chapter. Installation also supplies the closing actions.
  assert.equal(silicon.chapterOrder.length, 8)
  assert.equal(new Set(silicon.chapterOrder).size, silicon.chapterOrder.length)
  for (const id of silicon.chapterOrder) {
    const chapter = silicon[id]
    assert.equal(chapter.id, id, `Chapter ${id} must have a stable navigation anchor`)
    assert.ok(chapter.title.join(' ').trim().length >= 12, `${id}: provide a substantive heading`)
    assert.equal(Object.hasOwn(chapter, 'number'), false, `${id}: editorial labels must not carry section counters`)
  }
  const navigationAnchors = silicon.navigation.filter(link => link.href.startsWith('#'))
  for (const {href} of navigationAnchors) {
    assert.ok(silicon.chapterOrder.includes(href.slice(1)), `Navigation anchor ${href} has no chapter`)
  }
})

test('landing presentation omits section eyebrows and inspection-style footer controls', () => {
  for (const chapter of ['Hero', 'Cloud', 'Network', 'Architecture', 'Security', 'Install']) {
    const source = readProjectFile(`src/components/landing/sections/${chapter}Chapter.jsx`)
    assert.doesNotMatch(source, /ChapterLabel|className=['"]chapter-label/, `${chapter}: use headings instead of tiny section eyebrows`)
  }
  const footer = readProjectFile('src/components/landing/sections/Footer.jsx')
  assert.doesNotMatch(footer, /Product reference|Reduce motion|motion-preference|type=['"]checkbox/, 'Release verification and OS reduced-motion support should not become decorative footer controls')
  assert.match(footer, /Documentation/)
  assert.match(footer, /GitHub/)
  assert.doesNotMatch(readProjectFile('src/components/landing/sections/NetworkChapter.jsx'), /className=['"]diagram-caption/, 'Remove inspection-style annotations around the network diagram')
})

test('the product reference names an exact semantic release and commit', () => {
  assert.match(silicon.release, /^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/)
  assert.match(silicon.releaseCommit, /^[a-f0-9]{40}$/)
  assert.notEqual(silicon.releaseCommit, '0'.repeat(40))
  assert.equal(silicon.repository, 'https://github.com/itsmangooo/Silicon')
})

test('content documentation links resolve to the independent Markdown site', () => {
  const links = collectObjects(silicon, value => value.href?.startsWith('/docs'))
  assert.ok(links.length > 0)
  for (const {href} of links) {
    const route = href.split(/[?#]/, 1)[0].replace(/\/$/, '')
    assert.ok(route === '/docs' || route.startsWith('/docs/'), `Invalid docs route: ${href}`)
    const relativeFile = route === '/docs' ? 'intro' : route.slice('/docs/'.length)
    assert.ok(existsSync(new URL(`docs/${relativeFile}.md`, projectRoot)), `No Markdown page for ${href}`)
  }
  assert.match(readProjectFile('docs/intro.md'), /^---\r?\nslug: \/\r?\n/, 'Docs index should resolve to /docs/')
})

test('installation command comes from the operator guide and explains exact releases', () => {
  const installation = readProjectFile('docs/getting-started/installation.md')
  assert.ok(installation.includes(silicon.install.command), 'Keep the command aligned with the current guide')
  assert.match(silicon.install.command, /^curl -fsSL https:\/\/raw\.githubusercontent\.com\/itsmangooo\/Silicon\/main\/install\.sh \| sh$/)
  assert.match(silicon.install.note, /inspect install\.sh/)
  assert.match(silicon.install.note, /default source is main/)
  assert.ok(silicon.install.note.includes(`--version ${silicon.release}`), 'State how to select the verified release')
  assert.ok(installation.includes('--version <tag>'), 'The documented installer must support the release caveat')
})

test('implemented providers remain distinct from extension contracts and current limits', () => {
  const implementedProviders = silicon.architecture.providers.flat().join(' ')
  assert.doesNotMatch(implementedProviders, /\b(?:Kubernetes|Azure|OIDC|IdentityProvider|LogProvider|Traefik|Nginx)\b/)
  assert.match(silicon.architecture.extensions, /IdentityProvider and LogProvider are extension contracts/)
  assert.match(silicon.architecture.extensions, /OIDC login.*not implemented/)

  const networkingGuide = readProjectFile('docs/guides/private-networking.md')
  assert.match(networkingGuide, /one network member may host only one attached application/)
  assert.match(silicon.network.limitation, /One attached application per network member/)
  assert.match(silicon.network.limitation, /no NAT traversal, direct-peer optimization, or high-availability hub/)
  assert.match(silicon.network.notes.join(' '), /Private IPv4.*hub-and-spoke/)
  assert.match(silicon.aws.limitation, /does not replace the full AWS Console/)
  assert.match(silicon.aws.limitation, /does not.*configure a complete VPC internet\/NAT topology/)
  assert.match(silicon.aws.details.flat().join(' '), /Use SSH for Git builds.*SSM provides bounded checks/)
})
