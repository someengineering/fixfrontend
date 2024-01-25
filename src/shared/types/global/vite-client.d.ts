/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIX_LANDING_PAGE_URL?: string
  readonly VITE_SERVER?: string
  readonly VITE_WS_SERVER?: string
  readonly VITE_USE_PROXY?: string
  readonly VITE_NETWORK_RETRY_COUNT?: string
  readonly VITE_WEBSOCKET_RETRY_TIMEOUT?: string
  readonly VITE_DISCORD_URL?: string
  readonly VITE_GTM_DEV_ID?: string
  readonly VITE_GTM_PROD_ID?: string
  readonly VITE_TRACKJS_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
