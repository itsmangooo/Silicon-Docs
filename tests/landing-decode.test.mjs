import assert from 'node:assert/strict'
import test from 'node:test'
import {decodedFrame, DECODE_FRAMES, DECODE_FRAME_MS} from '../src/components/landing/motion/decode.mjs'

test('technical decoding is deterministic and resolves the prefix progressively', () => {
  const text = 'Verified SSH'
  assert.match(decodedFrame(text, 0), /^[01AF7#/X ]+$/)
  assert.equal(decodedFrame(text, 0), decodedFrame(text, 0))
  assert.notEqual(decodedFrame(text, 0), decodedFrame(text, 1))
  for (let frame = 0; frame <= DECODE_FRAMES; frame++) {
    const result = decodedFrame(text, frame)
    const prefix = Math.floor(text.length * frame / DECODE_FRAMES)
    assert.equal(result.length, text.length)
    assert.equal(result.slice(0, prefix), text.slice(0, prefix))
    assert.equal(result[8], ' ')
  }
})

test('decoding ends in the exact final string within a bounded duration', () => {
  for (const text of ['Exact SHA', 'Verified SSH', '.internal discovery', '']) {
    assert.equal(decodedFrame(text, DECODE_FRAMES), text)
    assert.equal(decodedFrame(text, DECODE_FRAMES + 1), text)
    assert.equal(decodedFrame(text, -1), decodedFrame(text, 0))
  }
  assert.ok(DECODE_FRAMES * DECODE_FRAME_MS < 600)
})
