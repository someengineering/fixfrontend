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
  apiUrl: process.env.REACT_APP_USE_PROXY === 'true' ? defaultOrigin : process.env.REACT_APP_SERVER ?? defaultOrigin,
  wsUrl:
    process.env.REACT_APP_USE_PROXY === 'true'
      ? wsOrigin
      : process.env.REACT_APP_WS_SERVER ?? process.env.REACT_APP_SERVER?.replace('http', 'ws') ?? wsOrigin,
  retryCount: envToNumber(process.env.REACT_APP_NETWORK_RETRY_COUNT) ?? 5,
  webSocketRetryTimeout: envToNumber(process.env.REACT_APP_WEBSOCKET_RETRY_TIMEOUT) ?? 5_000,
}
