/**
 * The shape of the dataLayer
 */
export type DataLayerType = {
  dataLayer: DataEventTypes[] | undefined
  dataLayerName: string
}

/**
 * The shape of the GTM Snippets
 */
export type SnippetsType = {
  gtmDataLayer: string
  gtmIframe: string
  gtmScript: string
}

/**
 * The variables required to use a GTM custom environment
 */
export type CustomEnvironmentParams = {
  /**
   * For the `gtm_auth` parameter.
   */
  gtm_auth: string

  /**
   * For the `gtm_preview` parameter.
   */
  gtm_preview: string
}

/**
 * The shape of the GTM Snippets params
 */
export type SnippetsParams = {
  dataLayer?: Pick<DataLayerType, 'dataLayer'>['dataLayer']
  dataLayerName?: Pick<DataLayerType, 'dataLayerName'>['dataLayerName']
  environment?: CustomEnvironmentParams
  nonce?: string
  id: string
  injectScript?: boolean
  /** Defaults to https://www.googletagmanager.com */
  customDomain?: string
  /** Defaults to gtm.js */
  customScriptName?: string
}

/**
 * The shape of the setupGTM function
 */
export type SetupGTMParams = {
  getDataLayerScript: () => HTMLElement
  getNoScript: () => HTMLElement
  getScript: () => HTMLElement
}

type DataEventCommonError = {
  name: string
  message: string
  stack: string
  workspaceId: string
  authorized: boolean
}

type DataEventPage = {
  event: 'page'
  language: string
  path: string
  search: string
  hash: string
  state: string
  workspaceId: string
  darkMode: boolean
  authorized: boolean
}

type DataEventError = DataEventCommonError & {
  event: 'error'
}

type DataEventSocketError = DataEventCommonError & {
  event: 'websocket-error'
  state: 'on-message' | 'send-message' | 'on-close' | 'on-open'
  params: string
  api: string
}

type DataEventNetworkError = DataEventCommonError & {
  event: 'network-error'
  api: string
  responseData: string
  responseHeader: string
  responseStatus: string
  response: string
  request: string
  cause: string
  status: string
  config: string
  code: string
}

type DataEventInventorySearch = {
  event: 'inventory-search'
  q: string
  workspaceId: string
  authorized: boolean
}

type DataEventInventoryError = DataEventCommonError & {
  event: 'inventory-error'
  isAdvanceSearch: boolean
  api: string
  params: unknown
  response: string
  request: string
  status: number | string
}

type DataEventLogin = {
  event: 'login'
  username: string
}

type DataEventSignup = {
  event: 'signup'
  username: string
}

export type DataEventTypes =
  | DataEventPage
  | DataEventError
  | DataEventSocketError
  | DataEventNetworkError
  | DataEventInventorySearch
  | DataEventInventoryError
  | DataEventLogin
  | DataEventSignup

/**
 * The shape of the sendToGtm function
 */
export type SendToGTMParams = {
  dataLayerName: keyof typeof window
  data: DataEventTypes
}
