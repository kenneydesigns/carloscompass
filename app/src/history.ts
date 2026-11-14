export interface HistoricalPeriod {
  from: number
  to: number
  title: string
  subtitle?: string
  summary?: string
  source?: string
}

export function periodAt<T extends { from: number; to: number }>(periods: T[], year: number): T | undefined {
  return periods.find(p => year >= p.from && year <= p.to)
}

export function nextPeriodYear(periods: { from: number }[], year: number, direction: -1 | 1): number | undefined {
  const dates = periods.map(p => p.from).sort((a, b) => a - b)
  return direction === 1 ? dates.find(d => d > year) : dates.reverse().find(d => d < year)
}
