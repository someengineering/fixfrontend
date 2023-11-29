import { FailedCheck, SeverityType } from './shared'

export type FailedChecksType<value = number> = Record<SeverityType, value>

export interface Benchmark {
  id: string
  title: string
  framework: string
  version: string
  clouds: string[]
  description: string
  nr_of_checks: number
  account_summary: Record<
    string,
    {
      score: number
      failed_checks: FailedChecksType | null
      failed_resources: FailedChecksType | null
    }
  >
}

export interface ChangedSitatuation {
  since: string
  accounts_selection: string[]
  resource_count_by_kind_selection: Record<string, number>
  resource_count_by_severity: FailedChecksType
}

export type WorkspaceAccountReportSummary = {
  id: string
  name: string
  cloud: string
  score: number
  resource_count: number
}

export interface WorkspaceCheckSummary {
  available_checks: number
  available_resources: number
  failed_checks: number
  failed_checks_by_severity: FailedChecksType
  failed_resources: number
  failed_resources_by_severity: FailedChecksType
}

export interface GetWorkspaceInventoryReportSummaryResponse {
  overall_score: number
  check_summary: WorkspaceCheckSummary
  account_check_summary: WorkspaceCheckSummary
  accounts: WorkspaceAccountReportSummary[]
  benchmarks: Benchmark[]
  changed_vulnerable: ChangedSitatuation
  changed_compliant: ChangedSitatuation
  top_checks: FailedCheck[]
}
