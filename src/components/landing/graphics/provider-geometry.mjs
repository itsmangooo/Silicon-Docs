// One shared coordinate system owns every desktop rectangle and connector.
// This intentionally bounded diagram represents up to eight provider groups.
export const providerSystemGeometry = {
  width: 1200,
  height: 740,
  core: {x: 420, y: 16, width: 360, height: 152},
  columns: [20, 320, 620, 920],
  rows: [278, 536],
  buses: [222, 480],
  node: {width: 260, height: 156},
}

export const providerSystemCoreAnchor = {
  x: providerSystemGeometry.core.x + providerSystemGeometry.core.width / 2,
  y: providerSystemGeometry.core.y + providerSystemGeometry.core.height,
}

export function createProviderLayout(providers) {
  const geometry = providerSystemGeometry
  const capacity = geometry.columns.length * geometry.rows.length
  if (!Array.isArray(providers)) throw new TypeError('Providers must be an array of category/implementation pairs.')
  if (providers.length < 1 || providers.length > capacity) throw new RangeError(`The provider diagram supports between 1 and ${capacity} groups.`)
  return providers.map((provider, index) => {
    if (!Array.isArray(provider) || provider.length !== 2 || provider.some(value => typeof value !== 'string' || !value.trim())) {
      throw new TypeError('Each provider requires a non-empty category and implementation.')
    }
    const [category, implementation] = provider
    const row = Math.floor(index / geometry.columns.length)
    const x = geometry.columns[index % geometry.columns.length]
    const y = geometry.rows[row]
    const startAnchor = {...providerSystemCoreAnchor}
    const endAnchor = {x: x + geometry.node.width / 2, y}
    return {
      category, implementation, index, x, y,
      width: geometry.node.width, height: geometry.node.height,
      startAnchor, endAnchor,
      path: `M${startAnchor.x} ${startAnchor.y} V${geometry.buses[row]} H${endAnchor.x} V${endAnchor.y}`,
    }
  })
}
