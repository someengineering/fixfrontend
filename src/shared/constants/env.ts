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

const env = {
  isLocal: undefined as boolean | undefined,
  isProd: undefined as boolean | undefined,
  landingPageUrl: import.meta.env.VITE_FIX_LANDING_PAGE_URL ?? defaultOrigin,
  apiUrl:
    import.meta.env.VITE_USE_PROXY === 'true' && import.meta.env.MODE !== 'test'
      ? defaultOrigin
      : import.meta.env.VITE_SERVER ?? defaultOrigin,
  wsUrl:
    import.meta.env.VITE_USE_PROXY === 'true' && import.meta.env.MODE !== 'test'
      ? wsOrigin
      : import.meta.env.VITE_WS_SERVER ?? import.meta.env.VITE_SERVER?.replace('http', 'ws') ?? wsOrigin,
  videosAssetsUrl: import.meta.env.VITE_VIDEOS_ASSETS_URL ?? defaultOrigin,
  retryCount: envToNumber(import.meta.env.VITE_NETWORK_RETRY_COUNT) ?? 5,
  webSocketRetryTimeout: envToNumber(import.meta.env.VITE_WEBSOCKET_RETRY_TIMEOUT) ?? 5_000,
  discordUrl: import.meta.env.VITE_DISCORD_URL ?? '#',
  aws_marketplace_url: undefined as string | undefined,
  muiLicenseKey: import.meta.env.VITE_MUI_LICENSE_KEY,
  loadPageTimeout: envToNumber(import.meta.env.VITE_LOAD_PAGE_TIMEOUT) ?? 30_000,
  posthogProjectApiKey: undefined as string | undefined,
  posthogApiHost: import.meta.env.VITE_POSTHOG_API_HOST ?? 'https://eu.posthog.com',
  posthogUiHost: import.meta.env.VITE_POSTHOG_UI_HOST,
}

export { env }
