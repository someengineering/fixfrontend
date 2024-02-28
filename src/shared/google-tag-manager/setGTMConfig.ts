import { GTMConfigParams } from './GoogleTagManagerTypes'
import { gtmId } from './gtmDispatch'

export const setGTMConfig = (config: GTMConfigParams): void => {
  if ('gtag' in window && gtmId) {
    window.gtag('config', gtmId, config)
  } else {
    if (!gtmId) {
      console.warn(`gtm has not been initialized`)
    }
    if (!('gtag' in window)) {
      console.warn(`gtag does not exist in window`)
    }
  }
}
