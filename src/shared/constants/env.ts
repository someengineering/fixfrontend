/// <reference types="vite/client" />

const envToNumber = (value?: string) => {
  const returnNumber = Number(value)
  if (Number.isNaN(returnNumber)) {
    return undefined
  }
  return returnNumber
}

const defaultOrigin = window.location.origin
const wsOrigin = defaultOrigin.replace('http', 'ws')

export const env = {
  apiUrl: import.meta.env.VITE_USE_PROXY === 'true' ? defaultOrigin : import.meta.env.VITE_SERVER ?? defaultOrigin,
  wsUrl:
    import.meta.env.VITE_USE_PROXY === 'true'
      ? wsOrigin
      : import.meta.env.VITE_WS_SERVER ?? import.meta.env.VITE_SERVER?.replace('http', 'ws') ?? wsOrigin,
  retryCount: envToNumber(import.meta.env.VITE_NETWORK_RETRY_COUNT) ?? 5,
  webSocketRetryTimeout: envToNumber(import.meta.env.VITE_WEBSOCKET_RETRY_TIMEOUT) ?? 5_000,
}
