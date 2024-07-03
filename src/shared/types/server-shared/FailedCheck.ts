import { NodeReported } from './NodeReported'
import { SeverityType } from './SeverityType'

export interface FailedCheck {
  benchmarks?: {
    id: string
    title: string
  }[]
  categories: string[]
  default_values: null | Record<string, string>
  detect: {
    fix_cmd?: string
    fix?: string
    manual?: string
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
  result_kinds: string[]
  number_of_resources_failing_by_account?: Record<string, number>
  resources_failing_by_account?: Record<string, NodeReported[]>
  number_of_resources_failing?: number
  risk: string
  service: string
  severity: SeverityType
  title: string
  url: string | null
}
