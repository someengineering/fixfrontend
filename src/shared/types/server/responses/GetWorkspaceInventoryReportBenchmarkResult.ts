import { Benchmark, EdgeType, FailedCheck, NodeType, SeverityType } from 'src/shared/types/server-shared'

export interface BenchmarkReportNode extends Omit<Benchmark, 'cloud'> {
  accounts?: string[]
  kind: 'report_benchmark'
  name: string
  only_failed: boolean
  severity: SeverityType | null
  documentation: null
}

export interface BenchmarkCheckCollectionNode {
  description: string
  documentation: null
  kind: 'report_check_collection'
  name: string
  title: string
}

export interface BenchmarkCheckResultNode extends FailedCheck {
  kind: 'report_check_result'
  name: string
}

export type GetWorkspaceInventoryReportBenchmarkResultItem =
  | NodeType<{ reported: BenchmarkReportNode | BenchmarkCheckCollectionNode | BenchmarkCheckResultNode }>
  | EdgeType<{ edge_type: 'default' }>

export type GetWorkspaceInventoryReportBenchmarkResultResponse = GetWorkspaceInventoryReportBenchmarkResultItem[]
