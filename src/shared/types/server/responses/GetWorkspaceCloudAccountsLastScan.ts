export type WorkspaceCloudAccountsLastScanAccount = {
  account_id: string
  resource_scanned: number
  duration: number
  started_at: string
}

export interface GetWorkspaceCloudAccountsLastScanResponse {
  workspace_id: string
  accounts: WorkspaceCloudAccountsLastScanAccount[]
  next_scan: string
}
