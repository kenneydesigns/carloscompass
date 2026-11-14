export interface BorderPeriod { year: number; from: number; to: number; file: string }

/** Choose only a snapshot explicitly assigned to the selected date. Gaps are intentional. */
export function borderForYear(periods: BorderPeriod[], year: number): BorderPeriod | undefined {
  return periods.find(period => year >= period.from && year <= period.to)
}
