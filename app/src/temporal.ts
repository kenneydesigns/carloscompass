export const MIN_YEAR = -1999
export const MAX_YEAR = 100
export function bcToAstronomical(year: number): number { return 1 - year }
export function formatAstronomicalYear(year: number): string { return year <= 0 ? `${1 - year} BC` : `${year} AD` }
export function toLegacyYear(year: number): number { return year <= 0 ? year - 1 : year }
export function fromLegacyYear(year: number): number { return year < 0 ? year + 1 : year }
export interface TimedFeature { startYear: number; endYear: number; category: string }
export function activeAt(feature: Pick<TimedFeature, 'startYear' | 'endYear'>, year: number): boolean { return year >= feature.startYear && year <= feature.endYear }
export function visibleAt(feature: TimedFeature, year: number, layers: Record<string, boolean>): boolean {
  return layers[feature.category] === true && activeAt(feature, year)
}
export function advanceYear(year: number, step: number, eventYears: number[]): number {
  const target = Math.min(MAX_YEAR, year + step)
  return eventYears.filter(y => y > year && y <= target).reduce((earliest, y) => Math.min(earliest, y), target)
}
