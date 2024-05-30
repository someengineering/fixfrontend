import { useEffect } from 'react'
import { useFullPageLoading } from './useFullPageLoading'

export interface FullPageLoadingSuspenseFallbackProps {
  forceFullPage?: boolean
}

export const FullPageLoadingSuspenseFallback = ({ forceFullPage }: FullPageLoadingSuspenseFallbackProps) => {
  const { hideLoading, showLoading } = useFullPageLoading()
  useEffect(() => {
    showLoading(forceFullPage)
    return () => {
      hideLoading(forceFullPage)
    }
  }, [showLoading, hideLoading, forceFullPage])
  return null
}
