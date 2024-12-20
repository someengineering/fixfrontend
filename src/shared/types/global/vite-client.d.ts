/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIX_LANDING_PAGE_URL?: string
  readonly VITE_FIX_DOCS_URL?: string
  readonly VITE_SERVER?: string
  readonly VITE_WS_SERVER?: string
  readonly VITE_VIDEOS_ASSETS_URL?: string
  readonly VITE_IMAGES_ASSETS_URL?: string
  readonly VITE_USE_PROXY?: string
  readonly VITE_MIN_ACTIVE_MINUTES?: string
  readonly VITE_NETWORK_RETRY_COUNT?: string
  readonly VITE_WEBSOCKET_RETRY_TIMEOUT?: string
  readonly VITE_DISCORD_URL?: string
  readonly VITE_MUI_LICENSE_KEY?: string
  readonly VITE_LOAD_PAGE_TIMEOUT?: string
  readonly VITE_POSTHOG_DEV_PROJECT_API_KEY?: string
  readonly VITE_POSTHOG_PROD_PROJECT_API_KEY?: string
  readonly VITE_POSTHOG_API_HOST?: string
  readonly VITE_POSTHOG_UI_HOST?: string
  readonly VITE_POSTHOG_TEST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
