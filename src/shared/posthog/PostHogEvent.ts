// Event strings should follow the convention documented in the
// PostHog docs: https://posthog.com/docs/libraries/js#capturing-events

export enum PostHogEvent {
  // User actions
  InventorySearch = 'inventory search performed',

  // Errors
  Error = 'error occurred',
  NetworkError = 'network error occurred',
  WebsocketError = 'websocket error occurred',
  InventoryError = 'inventory error occurred',
}
