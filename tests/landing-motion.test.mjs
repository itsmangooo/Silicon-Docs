import assert from 'node:assert/strict'
import test from 'node:test'
import {DEFAULT_DURATION, DEFAULT_EASE, readDuration, readEase, stageCountFor, stageFromProgress} from '../src/components/landing/motion/settings.mjs'

test('motion duration accepts CSS seconds, milliseconds, and unitless seconds', () => {
  for (const [value, expected] of [['.8', 0.8], ['.8s', 0.8], ['800ms', 0.8], [' 160ms ', 0.16], ['1.2s', 1.2], ['0s', 0]]) {
    assert.equal(readDuration(value), expected, value)
  }
  for (const value of ['', undefined, null, '-1s', 'slow', '1.2garbage', 'Infinity']) {
    assert.equal(readDuration(value), DEFAULT_DURATION, String(value))
  }
})

test('motion easing accepts cubic-bezier or coordinate tokens and validates timing coordinates', () => {
  assert.deepEqual(readEase('.22, 1, .36, 1'), [0.22, 1, 0.36, 1])
  assert.deepEqual(readEase('cubic-bezier(.22, 1, .36, 1)'), [0.22, 1, 0.36, 1])
  assert.deepEqual(readEase('0, -0.5, 1, 1.5'), [0, -0.5, 1, 1.5], 'Vertical coordinates may overshoot')
  for (const value of ['', undefined, null, 'ease-out', ',,,', '0, 1, 1', '-.1, 1, .5, 1', '.2, 1, 1.1, 1', 'cubic-bezier(.2, 1, .5, 1']) {
    assert.deepEqual(readEase(value), [...DEFAULT_EASE], String(value))
  }
})

test('native scroll story stages clamp progress and change at discrete thresholds', () => {
  for (const [progress, expected] of [[-1, 0], [0, 0], [0.2499, 0], [0.25, 1], [0.4999, 1], [0.5, 2], [0.7499, 2], [0.75, 3], [1, 3], [2, 3]]) {
    assert.equal(stageFromProgress(progress), expected, String(progress))
  }
  assert.equal(stageFromProgress(NaN), 0)
  assert.equal(stageFromProgress(-Infinity), 0)
  assert.equal(stageFromProgress(Infinity), 3)
  assert.equal(stageFromProgress(undefined), 0)
})

test('custom stage counts keep first and final states bounded', () => {
  assert.equal(stageCountFor(), 4)
  assert.equal(stageCountFor(NaN), 4)
  assert.equal(stageCountFor(Infinity), 4)
  assert.equal(stageCountFor(0), 1)
  assert.equal(stageCountFor(-2), 1)
  assert.equal(stageCountFor(3.8), 3)
  assert.equal(stageFromProgress(0, 6), 0)
  assert.equal(stageFromProgress(0.5, 6), 3)
  assert.equal(stageFromProgress(1, 6), 5)
  assert.equal(stageFromProgress(0, 1), 0)
  assert.equal(stageFromProgress(1, 1), 0)
})
