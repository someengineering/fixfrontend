export interface Account {
  id: string
  name: string
  cloud: string
  score: number
}

export type FailedChecksTypeKeys = 'critical' | 'high' | 'medium' | 'low'

export type FailedChecksType<value = number> = {
  [key in FailedChecksTypeKeys]: value
}

export interface Benchmark {
  id: string
  title: string
  framework: string
  version: string
  clouds: string[]
  description: string
  nr_of_checks: number
  account_summary: {
    [key in string]: {
      score: number
      failed_checks: Partial<FailedChecksType>
    }
  }
}

export interface ChangedSitatuation {
  since: string
  accounts_selection: string[]
  resource_count_by_kind_selection: Partial<{
    [key in string]: number
  }>
  resource_count_by_severity: Partial<FailedChecksType>
}

export interface TopChecks {
  categories: string[]
  default_values: null
  detect: {
    resoto_cmd: string
  }
  id: string
  provider: string
  related: null
  remediation: {
    action: null
    kind: string
    text: string
    url: string
  }
  result_kind: string
  risk: string
  service: string
  severity: FailedChecksTypeKeys
  title: string
  url: null
}

export interface GetWorkspaceInventoryReportSummaryResponse {
  overall_score: number
  check_summary: {
    available_checks: number
    failed_checks: number
    failed_checks_by_severity: Partial<FailedChecksType>
  }
  accounts: Account[]
  benchmarks: Benchmark[]
  changed_vulnerable: ChangedSitatuation
  changed_compliant: ChangedSitatuation
  top_checks: TopChecks[]
}
