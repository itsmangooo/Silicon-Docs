import assert from 'node:assert/strict'
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs'
import {join, resolve, sep} from 'node:path'

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
assert.ok(home.includes('Your infrastructure.'), 'Landing missing from public root')
assert.ok(home.includes(`${baseUrl}docs/`), 'Landing docs links must honor baseUrl')
assert.ok(home.includes('width="1440" height="1180"'), 'Hero needs intrinsic dimensions')
assert.ok(home.includes('loading="lazy"'), 'Chapter images must lazy load')
assert.ok(home.includes('sanitized demo data'), 'Product fixtures need a visible label')
assert.ok(home.includes('property="og:title" content="Silicon'), 'Landing needs social title metadata')
assert.ok(redirects > 40, 'Expected all existing documentation redirects')
assert.deepEqual(failures, [], `${failures.length} generated link/redirect failures`)
console.log(`Validated ${pages.length} HTML pages, ${references} local references, and ${redirects} legacy redirects at ${baseUrl}`)
