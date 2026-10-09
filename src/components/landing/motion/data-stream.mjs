export const STREAM_GLYPHS = '01ABCDEF/:.-#[]'
export const STREAM_TOKENS = ['SHA', 'SSH', 'AWS', 'SSM', 'DNS', 'API', 'TCP', 'WG', '8080']
export const STREAM_SETTLE_MS = 480
export const STREAM_ROW_HEIGHT = 30

export function streamDensity(section) {
  return section === 'hero' ? 5 : ['network', 'architecture'].includes(section) ? 1 : 3
}

export function streamText(row, cycle, mutation = 0) {
  const seed = Math.abs(row * 17 + cycle * 7)
  if (mutation === 0 && row % 11 === 3) return STREAM_TOKENS[seed % STREAM_TOKENS.length]
  return Array.from({length: row % 4 === 0 ? 2 : 1}, (_, index) =>
    STREAM_GLYPHS[(seed + index * 5 + mutation * 3) % STREAM_GLYPHS.length]).join('')
}

export function rowIsClear(y, railLeft, blockers) {
  return !blockers.some(rect => rect.right + 8 > railLeft && y >= rect.top - 12 && y <= rect.bottom + 12)
}
