// TODO: change servers here

const envToNumber = (value?: string) => {
  const returnNumber = Number(value)
  if (Number.isNaN(returnNumber)) {
    return undefined
  }
  return returnNumber
}

export const env = {
  apiUrl: process.env.REACT_APP_SERVER,
  retryCount: envToNumber(process.env.REACT_APP_NETWORK_RETRY_COUNT) ?? 5,
}
