export const DEFAULT_DURATION = 0.8
export const DEFAULT_STAGGER = 0.09
export const DEFAULT_EASE = Object.freeze([0.22, 1, 0.36, 1])

export function readDuration(value, fallback = DEFAULT_DURATION) {
  const match = String(value ?? '').trim().match(/^(\d+(?:\.\d*)?|\.\d+)(ms|s)?$/)
  if (!match) return fallback
  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return fallback
  return match[2] === 'ms' ? amount / 1000 : amount
}

export function readEase(value) {
  let source = String(value ?? '').trim()
  if (source.startsWith('cubic-bezier(') && source.endsWith(')')) source = source.slice(13, -1)
  const parts = source.split(',').map(part => part.trim())
  const number = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i
  if (parts.length !== 4 || !parts.every(part => number.test(part))) return [...DEFAULT_EASE]
  const coordinates = parts.map(Number)
  if (!coordinates.every(Number.isFinite) || coordinates[0] < 0 || coordinates[0] > 1 || coordinates[2] < 0 || coordinates[2] > 1) {
    return [...DEFAULT_EASE]
  }
  return coordinates
}

export function stageCountFor(stages = 4) {
  return Number.isFinite(stages) ? Math.max(1, Math.floor(stages)) : 4
}

export function stageFromProgress(progress, stages = 4) {
  const count = stageCountFor(stages)
  const normalized = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : progress === Infinity ? 1 : 0
  return Math.min(count - 1, Math.floor(normalized * count))
}
