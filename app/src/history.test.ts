import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { periodAt, nextPeriodYear } from './history.ts'

const eras = [{ from: -63, to: 69, title: 'Roman' }, { from: 70, to: 323, title: 'Roman city' }]
test('resolves eras at their boundaries and leaves gaps empty', () => {
  assert.equal(periodAt(eras, -64), undefined)
  assert.equal(periodAt(eras, 69)?.title, 'Roman')
  assert.equal(periodAt(eras, 70)?.title, 'Roman city')
  assert.equal(periodAt(eras, 324), undefined)
})
test('finds the next and previous period without skipping exact boundaries', () => {
  assert.equal(nextPeriodYear(eras, 0, 1), 70)
  assert.equal(nextPeriodYear(eras, 70, -1), -63)
  assert.equal(nextPeriodYear(eras, 70, 1), undefined)
})
