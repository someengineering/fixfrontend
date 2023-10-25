/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string
  readonly VITE_WS_SERVER: string
  readonly VITE_USE_PROXY: string
  readonly VITE_NETWORK_RETRY_COUNT: string
  readonly VITE_WEBSOCKET_RETRY_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
