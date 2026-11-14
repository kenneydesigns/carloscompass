import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { bcToAstronomical, formatAstronomicalYear, activeAt, visibleAt, advanceYear } from './temporal.ts'

test('astronomical year zero is 1 BC and there is no year zero in labels', () => {
  assert.equal(bcToAstronomical(1), 0)
  assert.equal(bcToAstronomical(2000), -1999)
  assert.equal(formatAstronomicalYear(0), '1 BC')
  assert.equal(formatAstronomicalYear(-1), '2 BC')
  assert.equal(formatAstronomicalYear(1), '1 AD')
})
test('temporal intervals include both endpoints', () => {
  const item = { startYear: -10, endYear: 10, category: 'events' }
  assert.equal(activeAt(item, -10), true)
  assert.equal(activeAt(item, 10), true)
  assert.equal(activeAt(item, 11), false)
})
test('layer visibility and date must both permit a feature', () => {
  const item = { startYear: -10, endYear: 10, category: 'events' }
  assert.equal(visibleAt(item, 0, { events: false }), false)
  assert.equal(visibleAt(item, 11, { events: true }), false)
  assert.equal(visibleAt(item, 0, { events: true }), true)
})
test('playback does not jump past a dated event', () => {
  assert.equal(advanceYear(-600, 25, [-585, 26]), -585)
  assert.equal(advanceYear(-585, 25, [-585, 26]), -560)
  assert.equal(advanceYear(90, 25, []), 100)
})
