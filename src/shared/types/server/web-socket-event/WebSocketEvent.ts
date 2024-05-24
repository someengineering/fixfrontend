interface WebSocketGenericEvent<Kind extends WebSocketEventKind, Data extends object> {
  id: string
  at: string | Date
  publisher: string
  kind: Kind
  data: Data
}

type CloudAccountType = 'aws' | 'gcp'

// TODO: remove aws specific events
type WebSocketEventKind =
  | 'cloud_account_configured'
  | 'cloud_account_deleted'
  | 'cloud_account_discovered'
  | 'cloud_account_degraded'
  | 'collect-progress'
  | 'collect-error'
  | 'tenant_accounts_collected'

export type CloudAccountConfiguredEvent = WebSocketGenericEvent<
  'cloud_account_configured',
  {
    cloud: CloudAccountType
    cloud_account_id: string
    workspace_id: string
    account_id: string
  }
>

export type CloudAccountDeletedEvent = WebSocketGenericEvent<
  'cloud_account_deleted',
  {
    cloud: CloudAccountType
    user_id: string
    cloud_account_id: string
    workspace_id: string
    account_id: string
  }
>

export type CloudAccountDiscoveredEvent = WebSocketGenericEvent<
  'cloud_account_discovered',
  {
    cloud: CloudAccountType
    cloud_account_id: string
    workspace_id: string
    account_id: string
  }
>

export type CloudAccountDegradedReason = 'stack_deleted' | 'other'

export type CloudAccountDegradedEvent = WebSocketGenericEvent<
  'cloud_account_degraded',
  {
    cloud: CloudAccountType
    cloud_account_id: string
    workspace_id: string
    account_id: string
    account_name: string
    error: string
    reason?: CloudAccountDegradedReason
  }
>

export type TenantAccountsCollectedEvent = WebSocketGenericEvent<
  'tenant_accounts_collected',
  {
    workspace_id: string
    cloud_accounts: Record<
      string,
      {
        account_id: string
        scanned_resources: number
        duration_seconds: number
        started_at: string
        task_id?: string
      }
    >
    next_run?: string
  }
>

export type CollectProgressEvent = WebSocketGenericEvent<
  'collect-progress',
  {
    workflow: string
    task: string
    message: {
      kind: string
      name: string
      parts: {
        kind: string
        name: string
        path?: string[]
        current: number
        total: number
      }[]
    }
  }
>

export type CollectErrorEvent = WebSocketGenericEvent<
  'collect-error',
  {
    workflow: string
    task: string
    message: string
  }
>

export type WebSocketEvent =
  | CloudAccountConfiguredEvent
  | CloudAccountDegradedEvent
  | CloudAccountDeletedEvent
  | CloudAccountDiscoveredEvent
  | TenantAccountsCollectedEvent
  | CollectProgressEvent
  | CollectErrorEvent
