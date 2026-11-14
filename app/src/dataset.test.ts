import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { activeAt } from './temporal.ts'

test('source-backed polygon snapshots produce distinct maps and gaps', () => {
  const data = JSON.parse(readFileSync('../packs/bible-catholic/geography/territories.geojson', 'utf8'))
  const at = (year: number) => data.features.filter((f: { properties: { startYear: number; endYear: number } }) => activeAt(f.properties, year))
  const early = at(-999), persian = at(-499)
  assert.ok(early.some((f: { properties: { name: string } }) => f.properties.name === 'Kingdom of David and Solomon'))
  assert.ok(persian.some((f: { properties: { name: string } }) => f.properties.name === 'Achaemenid Empire'))
  assert.ok(early.every((f: { geometry: { type: string }; properties: { source: string; confidence: string } }) => ['Polygon', 'MultiPolygon'].includes(f.geometry.type) && f.properties.source && f.properties.confidence === 'approximate'))
  assert.equal(at(-585).length, 0)
})
