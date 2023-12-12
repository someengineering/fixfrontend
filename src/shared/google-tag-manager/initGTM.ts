import { SetupGTMParams, SnippetsParams } from './GoogleTagManagerTypes'
import { getDataLayerSnippet, getGTMScript, getIframeSnippet } from './utils'

const setupGTM = (params: SnippetsParams) => {
  const getDataLayerScript = (): HTMLElement => {
    const dataLayerScript = window.document.createElement('script')
    if (params.nonce) {
      dataLayerScript.setAttribute('nonce', params.nonce)
    }
    dataLayerScript.innerHTML = getDataLayerSnippet(params.dataLayer, params.dataLayerName)
    return dataLayerScript
  }

  const getNoScript = (): HTMLElement => {
    const noScript = window.document.createElement('noscript')
    noScript.innerHTML = getIframeSnippet(params.id, params.environment, params.customDomain)
    return noScript
  }

  const getScript = (): HTMLElement => {
    const script = window.document.createElement('script')
    if (params.nonce) {
      script.setAttribute('nonce', params.nonce)
    }
    script.innerHTML = getGTMScript(params.dataLayerName, params.id, params.environment, params.customDomain, params.customScriptName)
    return script
  }

  return {
    getDataLayerScript,
    getNoScript,
    getScript,
  } as SetupGTMParams
}

export const initGTM = ({ dataLayer, dataLayerName, environment, nonce, id, customDomain, customScriptName }: SnippetsParams): void => {
  const gtm = setupGTM({
    dataLayer,
    dataLayerName,
    environment,
    nonce,
    id,
    customDomain,
    customScriptName,
  })

  const dataLayerScript = gtm.getDataLayerScript()
  const script = gtm.getScript()
  const noScript = gtm.getNoScript()

  window.document.head.insertBefore(dataLayerScript, window.document.head.childNodes[0])
  window.document.head.insertBefore(script, window.document.head.childNodes[1])
  window.document.body.insertBefore(noScript, window.document.body.childNodes[0])
}
