import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import test from 'node:test'
import {silicon} from '../src/landing/silicon/content.mjs'
import {
  providerSystemGeometry as geometry,
  providerSystemCoreAnchor,
  createProviderLayout,
} from '../src/components/landing/graphics/provider-geometry.mjs'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

function routeVertices(path) {
  const commands = [...path.matchAll(/([MVH])\s*(-?\d+(?:\.\d+)?)(?:\s+(-?\d+(?:\.\d+)?))?/g)]
  assert.equal(commands.map(match => match[0]).join('').replaceAll(/\s/g, ''), path.replaceAll(/\s/g, ''), 'Connectors must use bounded orthogonal commands')
  const vertices = []
  for (const [, command, first, second] of commands) {
    const previous = vertices.at(-1)
    if (command === 'M') vertices.push({x: Number(first), y: Number(second)})
    else {
      assert.ok(previous, 'A connector needs an initial coordinate')
      vertices.push(command === 'H' ? {x: Number(first), y: previous.y} : {x: previous.x, y: Number(first)})
    }
  }
  return vertices
}

test('provider connector endpoints derive exactly from the core and node rectangles', () => {
  const layout = createProviderLayout(silicon.architecture.providers)
  const coreBottomCenter = {x: geometry.core.x + geometry.core.width / 2, y: geometry.core.y + geometry.core.height}
  assert.deepEqual(providerSystemCoreAnchor, coreBottomCenter)
  assert.equal(layout.length, silicon.architecture.providers.length)

  for (const node of layout) {
    const nodeTopCenter = {x: node.x + node.width / 2, y: node.y}
    assert.deepEqual(node.startAnchor, coreBottomCenter)
    assert.deepEqual(node.endAnchor, nodeTopCenter)
    const vertices = routeVertices(node.path)
    assert.deepEqual(vertices[0], coreBottomCenter, `${node.category}: connector starts at the core edge`)
    assert.deepEqual(vertices.at(-1), nodeTopCenter, `${node.category}: connector ends at the node edge`)
    assert.ok(vertices.every(({x, y}) => Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= geometry.width && y >= 0 && y <= geometry.height))
    for (let index = 1; index < vertices.length; index++) {
      const current = vertices[index]
      const previous = vertices[index - 1]
      assert.ok(current.x === previous.x || current.y === previous.y, `${node.category}: connectors remain orthogonal`)
    }
  }
})

test('every implemented provider occupies a distinct bounded node without overlap', () => {
  const layout = createProviderLayout(silicon.architecture.providers)
  assert.deepEqual(layout.map(({category, implementation}) => [category, implementation]), silicon.architecture.providers)
  assert.equal(new Set(layout.map(node => `${node.x}:${node.y}`)).size, layout.length)
  const rectangles = [geometry.core, ...layout]
  for (const box of rectangles) {
    assert.ok(box.x >= 0 && box.y >= 0 && box.width > 0 && box.height > 0)
    assert.ok(box.x + box.width <= geometry.width && box.y + box.height <= geometry.height)
  }
  for (let index = 0; index < rectangles.length; index++) {
    for (const other of rectangles.slice(index + 1)) {
      const box = rectangles[index]
      const overlap = box.x < other.x + other.width && box.x + box.width > other.x && box.y < other.y + other.height && box.y + box.height > other.y
      assert.equal(overlap, false, 'Core and implemented provider nodes must not overlap')
    }
  }
})

test('provider layout rejects malformed or overflowing diagrams instead of drawing invalid geometry', () => {
  const capacity = geometry.columns.length * geometry.rows.length
  const valid = ['Runtime', 'Docker']
  assert.equal(createProviderLayout([valid]).length, 1)
  assert.equal(createProviderLayout(Array.from({length: capacity}, () => valid)).length, capacity)
  for (const invalid of [null, {}, ['Runtime'], [['Runtime', '']], [['Runtime', 'Docker', 'Extra']]]) {
    assert.throws(() => createProviderLayout(invalid), TypeError)
  }
  assert.throws(() => createProviderLayout([]), RangeError)
  assert.throws(() => createProviderLayout(Array.from({length: capacity + 1}, () => valid)), RangeError)
  const first = createProviderLayout([valid])[0]
  first.startAnchor.x = -1
  assert.deepEqual(createProviderLayout([valid])[0].startAnchor, providerSystemCoreAnchor, 'Each layout owns its anchors without mutating the common core')
})

test('desktop and compact architecture share provider data while extension contracts remain separate', () => {
  // Source contracts supplement the executable coordinate tests. Responsive
  // connector placement and real text wrapping still require browser review.
  const component = read('src/components/landing/graphics/ProviderSystem.jsx')
  const styles = read('src/css/landing/architecture.css')
  assert.match(component, /from ['"]\.\/provider-geometry\.mjs['"]/, 'Rectangles and paths must use the shared coordinate model')
  assert.match(component, /createProviderLayout\(providers\)/)
  assert.match(component, /nodes\.map\([^]*?<DesktopNode/, 'Desktop nodes should use the generated layout')
  assert.match(component, /<dl\b[^>]*className="provider-system__compact-list"[^]*?providers\.map\([^]*?<CompactNode/, 'Compact semantic nodes should use the same provider data')
  assert.match(component, /<title\b/)
  assert.match(component, /<desc\b/)
  assert.match(component, /aria-labelledby=/)
  assert.ok(component.indexOf('provider-system__legend') > component.indexOf('provider-system__compact-list'), 'Contracts belong below the implemented graph')
  assert.match(styles, /\.provider-system__core-shape\s*\{[^}]*fill:\s*var\(--paper\)/)
  assert.match(styles, /\.provider-system__node-shape\s*\{[^}]*fill:\s*var\(--surface\)/)
  assert.match(styles, /\.provider-system__contract\s*\{[^}]*border:\s*1px dashed/)
  assert.match(styles, /@media\s*\(max-width:\s*1100px\)[^]*?\.provider-system__desktop\s*\{\s*display:\s*none/)
  assert.match(styles, /@media\s*\(max-width:\s*1100px\)[^]*?\.provider-system__compact\s*\{\s*display:\s*block/)
  assert.match(styles, /@media\s*\(max-width:\s*600px\)[^]*?\.provider-system__compact-list\s*\{[^}]*grid-template-columns:\s*1fr/)
  assert.doesNotMatch(styles, /\.provider-system__desktop\s*\{[^}]*(?:scale|transform):/, 'Compact layouts must replace, rather than shrink, the desktop diagram')
})
