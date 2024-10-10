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
const isLocal = window?.location?.host?.indexOf?.('localhost') === 0 || window?.location?.host?.indexOf?.('127.0.0.1') === 0 || false
const isTest = import.meta.env.MODE === 'test'

const env = {
  isLocal,
  isTest,
  isProd: undefined as boolean | undefined,
  landingPageUrl: import.meta.env.VITE_FIX_LANDING_PAGE_URL ?? defaultOrigin,
  docsUrl: import.meta.env.VITE_FIX_DOCS_URL ?? defaultOrigin,
  apiUrl: import.meta.env.VITE_USE_PROXY === 'true' && !isTest ? defaultOrigin : (import.meta.env.VITE_SERVER ?? defaultOrigin),
  bookACallUrl: import.meta.env.VITE_BOOK_A_CALL_URL ?? '#',
  discordUrl: import.meta.env.VITE_DISCORD_URL ?? '#',
  githubUrl: import.meta.env.VITE_GITHUB_URL ?? '#',
  wsUrl:
    import.meta.env.VITE_USE_PROXY === 'true' && !isTest
      ? wsOrigin
      : (import.meta.env.VITE_WS_SERVER ?? import.meta.env.VITE_SERVER?.replace('http', 'ws') ?? wsOrigin),
  videosAssetsUrl: import.meta.env.VITE_VIDEOS_ASSETS_URL ?? defaultOrigin,
  imagesAssetsUrl: import.meta.env.VITE_IMAGES_ASSETS_URL ?? defaultOrigin,
  minActiveMinutes: envToNumber(import.meta.env.VITE_MIN_ACTIVE_MINUTES) ?? 60,
  retryCount: envToNumber(import.meta.env.VITE_NETWORK_RETRY_COUNT) ?? 5,
  webSocketRetryTimeout: envToNumber(import.meta.env.VITE_WEBSOCKET_RETRY_TIMEOUT) ?? 5_000,
  muiLicenseKey: import.meta.env.VITE_MUI_LICENSE_KEY,
  loadPageTimeout: envToNumber(import.meta.env.VITE_LOAD_PAGE_TIMEOUT) ?? 30_000,
  postHogProjectApiKey: undefined as string | undefined,
  postHogApiHost: import.meta.env.VITE_POSTHOG_API_HOST ?? 'https://eu.posthog.com',
  postHogUiHost: import.meta.env.VITE_POSTHOG_UI_HOST,
  postHogTest: import.meta.env.VITE_POSTHOG_TEST === 'true',
}

export { env }
