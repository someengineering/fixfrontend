import { SendToGTMParams } from './GoogleTagManagerTypes'

export const sendToGTM = ({ dataLayerName, data }: SendToGTMParams): void => {
  const dataLayer = window[dataLayerName] && Array.isArray(window[dataLayerName]) ? (window[dataLayerName] as unknown[]) : undefined
  if (dataLayer) {
    dataLayer.push(data)
  } else {
    console.warn(`dataLayer ${dataLayerName} does not exist`)
  }
  if ('gtag' in window && 'event' in data) {
    const { event, ...rest } = data
    window.gtag('event', event, rest)
  } else {
    console.warn(`gtag does not exist in window`)
  }
}
