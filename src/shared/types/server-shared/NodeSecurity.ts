import { SeverityType } from './SeverityType'

export type NodeSecurity = {
  issues: {
    benchmarks: string[]
    check: string
    severity: SeverityType
    opened_at: string
    run_id: string
  }[]
  opened_at: string
  reopen_counter: number
  run_id: string
  has_issues: boolean
  severity: SeverityType
}
