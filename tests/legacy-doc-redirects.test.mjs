import assert from 'node:assert/strict'
import test from 'node:test'
import {createLegacyDocRedirects} from '../config/legacy-doc-redirects.mjs'

test('old documentation routes follow their new docs routes', () => {
  assert.deepEqual(createLegacyDocRedirects('/docs/getting-started/installation'), [
    '/getting-started/installation',
  ])
  assert.deepEqual(createLegacyDocRedirects('/docs/guides/private-networking'), [
    '/guides/private-networking',
  ])
})

test('new documentation pages gain old-style aliases without a content list', () => {
  assert.deepEqual(createLegacyDocRedirects('/docs/guides/new-feature'), [
    '/guides/new-feature',
  ])
  assert.deepEqual(createLegacyDocRedirects('/docs/developers/nested/topic/'), [
    '/developers/nested/topic/',
  ])
})

test('the landing route stays available and non-doc routes gain no aliases', () => {
  for (const path of ['/', '/docs', '/docs/', '/product', '/docs-preview/example']) {
    assert.equal(createLegacyDocRedirects(path), undefined)
  }
})

test('redirect paths stay site-relative for GitHub Pages and root deployments', () => {
  // The redirect plugin adds the configured baseUrl after this callback.
  const [legacyPath] = createLegacyDocRedirects('/docs/security/ssh')
  for (const baseUrl of ['/Silicon-Docs/', '/']) {
    const deployedPath = `${baseUrl}${legacyPath.slice(1)}`
    assert.equal(deployedPath, `${baseUrl}security/ssh`)
  }
})
