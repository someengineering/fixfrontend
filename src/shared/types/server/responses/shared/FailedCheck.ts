import { SeverityType } from './SeverityType'

export interface FailedCheck {
  categories: string[]
  default_values: null | {
    certificate_expiration: string
  }
  detect: {
    resoto_cmd?: string
    resoto?: string
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
  severity: SeverityType
  title: string
  url: null
}
