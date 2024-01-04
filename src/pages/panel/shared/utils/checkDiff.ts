import { FailedChecksType } from 'src/shared/types/server'

export const checkDiff = (
  compliant: Partial<FailedChecksType<number>>,
  vulnerable: Partial<FailedChecksType<number>>,
  available_checks: number,
) => {
  return Math.round(
    (((compliant.critical ?? 0) * 4 +
      (compliant.high ?? 0) * 3 +
      (compliant.medium ?? 0) * 2 +
      (compliant.low ?? 0) -
      (vulnerable.critical ?? 0) * 4 -
      (vulnerable.high ?? 0) * 3 -
      (vulnerable.medium ?? 0) * 2 -
      (vulnerable.low ?? 0)) /
      (available_checks * 4)) *
      100,
  )
}
