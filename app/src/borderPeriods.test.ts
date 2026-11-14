import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { borderForYear } from './borderPeriods.ts'

const periods = [
  { year: 100, from: -50, to: 300, file: '100' },
  { year: 1200, from: 1100, to: 1300, file: '1200' },
]
test('selects the period only within its stated coverage', () => {
  assert.equal(borderForYear(periods, -50)?.year, 100)
  assert.equal(borderForYear(periods, 300)?.year, 100)
  assert.equal(borderForYear(periods, 1200)?.year, 1200)
  assert.equal(borderForYear(periods, 500), undefined)
  assert.equal(borderForYear(periods, 1400), undefined)
})
