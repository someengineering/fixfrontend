interface WebSocketGenericEvent<Kind extends WebSocketEventKind, Data extends object> {
  id: string
  at: string | Date
  publisher: string
  kind: Kind
  data: Data
}

type WebSocketEventKind = 'cloud_account_created' | 'collect-progress' | 'collect-error'

export type CloudAccountCreatedEvent = WebSocketGenericEvent<
  'cloud_account_created',
  {
    cloud_account_id: string
    workspace_id: string
    aws_account_id: string
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

export type WebSocketEvent = CloudAccountCreatedEvent | CollectProgressEvent | CollectErrorEvent
