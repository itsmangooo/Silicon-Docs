const GLYPHS = '01AF7#/X'
export const DECODE_FRAMES = 14
export const DECODE_FRAME_MS = 38

// Reproducible frames, with whitespace and the resolved prefix kept intact.
export function decodedFrame(text, frame) {
  const characters = [...text]
  const tick = Math.max(0, Math.min(DECODE_FRAMES, Math.floor(frame)))
  const resolved = Math.floor(characters.length * tick / DECODE_FRAMES)
  const seed = characters.reduce((total, character) => total + character.codePointAt(0), 0)
  return characters.map((character, index) => index < resolved || /\s/.test(character)
    ? character : GLYPHS[(seed + index * 7 + tick * 3) % GLYPHS.length]).join('')
}
