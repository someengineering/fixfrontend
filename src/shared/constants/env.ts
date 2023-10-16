const envToNumber = (value?: string) => {
  const returnNumber = Number(value)
  if (Number.isNaN(returnNumber)) {
    return undefined
  }
  return returnNumber
}

export const env = {
  apiUrl: process.env.REACT_APP_SERVER,
  wsUrl: process.env.REACT_APP_WS_SERVER,
  retryCount: envToNumber(process.env.REACT_APP_NETWORK_RETRY_COUNT) ?? 5,
  webSocketRetryTimeout: envToNumber(process.env.REACT_APP_WEBSOCKET_RETRY_TIMEOUT) ?? 5_000,
}
