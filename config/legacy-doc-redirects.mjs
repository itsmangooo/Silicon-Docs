/**
 * Docusaurus supplies site-relative paths to createRedirects and adds baseUrl
 * when it writes redirect pages. Deriving aliases from the generated routes
 * preserves existing documentation links without maintaining a second list.
 * The old documentation index becomes the landing page, so it has no alias.
 */
export function createLegacyDocRedirects(existingPath) {
  const docsPrefix = '/docs/'

  if (!existingPath.startsWith(docsPrefix) || existingPath === docsPrefix) {
    return undefined
  }

  return [existingPath.slice('/docs'.length)]
}
