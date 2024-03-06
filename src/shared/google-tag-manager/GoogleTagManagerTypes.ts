import { GTMEventNames } from 'src/shared/constants'

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

type DataEventCommon = {
  user_id?: string
}

type DataEventCommonError = DataEventCommon & {
  name: string
  message: string
  stack: string
  workspaceId: string
  authorized: boolean
}

type DataEventPage = DataEventCommon & {
  event: GTMEventNames.Page
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
  event: GTMEventNames.Error
}

type DataEventSocketError = DataEventCommonError & {
  event: GTMEventNames.WebsocketError
  state: 'on-message' | 'send-message' | 'on-close' | 'on-open'
  params: string
  api: string
}

type DataEventNetworkError = DataEventCommonError & {
  event: GTMEventNames.NetworkError
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

type DataEventInventorySearch = DataEventCommon & {
  event: GTMEventNames.InventorySearch
  q: string
  workspaceId: string
  authorized: boolean
}

type DataEventInventoryError = DataEventCommonError & {
  event: GTMEventNames.InventoryError
  isAdvanceSearch: boolean
  api: string
  params: unknown
  response: string
  request: string
  status: number | string
}

type DataEventLogin = DataEventCommon & {
  event: GTMEventNames.Login
  username: string
}

type DataEventSignup = DataEventCommon & {
  event: GTMEventNames.Signup
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
  | DataEventCommon

/**
 * The shape of the sendToGtm function
 */
export type SendToGTMParams = {
  dataLayerName: keyof typeof window
  data: DataEventTypes
}

export type GTMConfigParams = Record<string, unknown>
