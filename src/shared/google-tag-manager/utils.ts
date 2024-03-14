import { CustomEnvironmentParams, DataLayerType, SnippetsParams, SnippetsType } from './GoogleTagManagerTypes'

export const DEFAULT_DOMAIN = 'https://www.googletagmanager.com'
export const DEFAULT_SCRIPT_NAME = 'gtag/js'

/**
 * Function to get and set dataLayer
 * @param dataLayer - The dataLayer
 * @param dataLayerName - The dataLayer name
 */
export const getDataLayerSnippet = (
  dataLayer: Pick<DataLayerType, 'dataLayer'>['dataLayer'],
  dataLayerName: Pick<DataLayerType, 'dataLayerName'>['dataLayerName'] = 'dataLayer',
): Pick<SnippetsType, 'gtmDataLayer'>['gtmDataLayer'] =>
  `window.${dataLayerName} = window.${dataLayerName} || [];` +
  (dataLayer ? `window.${dataLayerName}.push(${JSON.stringify(dataLayer)})` : '')

/**
 * Function to get the Iframe snippet
 * @param environment - The parameters to use a custom environment
 * @param customDomain - Custom domain for gtm
 * @param id - The id of the container
 */
export const getIframeSnippet = (
  id: Pick<SnippetsParams, 'id'>['id'],
  environment?: CustomEnvironmentParams,
  customDomain: SnippetsParams['customDomain'] = DEFAULT_DOMAIN,
  nonce?: string,
) => {
  let params = ``
  if (environment) {
    const { gtm_auth, gtm_preview } = environment
    params = `&gtm_auth=${gtm_auth}&gtm_preview=${gtm_preview}&gtm_cookies_win=x`
  }
  return `<iframe src="${customDomain}/ns.html?id=${id}${params}" height="0" width="0" style="display:none;visibility:hidden" nonce="${nonce}" id="tag-manager"></iframe>`
}

/**
 * Function to get the GTM script
 * @param dataLayerName - The name of the dataLayer
 * @param customDomain - Custom domain for gtm
 * @param customScriptName - Custom script file name for gtm
 * @param environment - The parameters to use a custom environment
 * @param id - The id of the container
 */
export const getGTMScript = (
  dataLayerName: Pick<SnippetsParams, 'dataLayerName'>['dataLayerName'],
  id: Pick<SnippetsParams, 'id'>['id'],
  environment?: CustomEnvironmentParams,
  customDomain: SnippetsParams['customDomain'] = DEFAULT_DOMAIN,
  customScriptName: SnippetsParams['customScriptName'] = DEFAULT_SCRIPT_NAME,
) => {
  let params = ``
  if (environment) {
    const { gtm_auth, gtm_preview } = environment
    params = `+"&gtm_auth=${gtm_auth}&gtm_preview=${gtm_preview}&gtm_cookies_win=x"`
  }
  return `
    (function(w,d,s,l,i){w[l]=w[l]||[];w.gtag = function(){w[l].push(arguments);};gtag('js', new Date());gtag('config', i);
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      '${customDomain}/${customScriptName}?id='+i+dl${params};f.parentNode.insertBefore(j,f);
    })(window,document,'script','${dataLayerName}','${id}');
  `
}
