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
      failed_checks: Partial<FailedChecksType> | null
      failed_resource_checks: Partial<FailedChecksType> | null
    }
  >
}

export interface ChangedSituation {
  since: string
  accounts_selection: string[]
  resource_count_by_kind_selection: Record<string, number>
  resource_count_by_severity: Partial<FailedChecksType>
}

export type WorkspaceAccountReportSummary = {
  id: string
  name: string
  cloud: string
  score: number
  resource_count: number
  failed_resources_by_severity: Partial<FailedChecksType> | null
}

export interface WorkspaceCheckSummary {
  available_checks: number
  available_resources: number
  failed_checks: number
  failed_checks_by_severity: Partial<FailedChecksType>
  failed_resources: number
  failed_resources_by_severity: Partial<FailedChecksType>
}

export interface vulnerableResource {
  at: string
  group: { severity: SeverityType }
  v: number
}

export interface vulnerableResources {
  data: vulnerableResource[]
  end: string
  granularity: string
  name: string
  start: string
}

export interface GetWorkspaceInventoryReportSummaryResponse {
  overall_score: number
  check_summary: WorkspaceCheckSummary
  accounts: WorkspaceAccountReportSummary[]
  benchmarks: Benchmark[]
  changed_vulnerable: ChangedSituation
  changed_compliant: ChangedSituation
  top_checks: FailedCheck[]
  vulnerable_resources: vulnerableResources | null
}
