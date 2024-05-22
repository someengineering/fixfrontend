import { useEffect } from 'react'
import { env } from 'src/shared/constants'
import { useFullPageLoading } from './useFullPageLoading'

export interface FullPageLoadingSuspenseFallbackProps {
  forceFullPage?: boolean
}

export const FullPageLoadingSuspenseFallback = ({ forceFullPage }: FullPageLoadingSuspenseFallbackProps) => {
  const { hideLoading, showLoading } = useFullPageLoading()
  useEffect(() => {
    showLoading(forceFullPage)
    const timeout = window.setTimeout(() => {
      if (window.TrackJS?.isInstalled()) {
        window.TrackJS.track(new Error(`It took more than ${env.loadPageTimeout / 1000}s to load the page`))
      }
      window.setTimeout(function () {
        window.location.reload()
      }, 3_000)
    }, env.loadPageTimeout)
    return () => {
      window.clearTimeout(timeout)
      hideLoading(forceFullPage)
    }
  }, [showLoading, hideLoading, forceFullPage])
  return null
}
