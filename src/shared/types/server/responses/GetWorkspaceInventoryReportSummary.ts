export interface Account {
  id: string
  name: string
  cloud: string
}

export interface Benchmark {
  id: string
  title: string
  framework: string
  version: string
  clouds: string[]
  description: string
  nr_of_checks: 0
  failed_checks: {
    [key in string]: {
      [key in string]: number
    }
  }
}

export interface GetWorkspaceInventoryReportSummaryResponse {
  accounts: Account[]
  benchmarks: Benchmark[]
}
