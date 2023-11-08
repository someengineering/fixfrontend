import { GetWorkspaceInventoryReportSummaryResponse } from 'src/shared/types/server'

export const checkDiff = (data: GetWorkspaceInventoryReportSummaryResponse) => {
  const compliant = data.changed_compliant.resource_count_by_severity
  const vulnerable = data.changed_vulnerable.resource_count_by_severity
  return Math.round(
    ((compliant.critical ?? 0) * 4 +
      (compliant.high ?? 0) * 3 +
      (compliant.medium ?? 0) * 2 +
      (compliant.low ?? 0) -
      (vulnerable.critical ?? 0) * 4 -
      (vulnerable.high ?? 0) * 3 -
      (vulnerable.medium ?? 0) * 2 -
      (vulnerable.low ?? 0)) /
      (data.check_summary.available_checks * 4),
  )
}
