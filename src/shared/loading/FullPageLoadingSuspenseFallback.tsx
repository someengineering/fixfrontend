import { useEffect } from 'react'
import { useFullPageLoading } from './useFullPageLoading'

export interface FullPageLoadingSuspenseFallbackProps {
  withLoading?: boolean
  forceFullpage?: boolean
}

export const FullPageLoadingSuspenseFallback = ({ withLoading, forceFullpage }: FullPageLoadingSuspenseFallbackProps) => {
  const { hideLoading, showLoading } = useFullPageLoading()
  useEffect(() => {
    showLoading(false, forceFullpage)
    return () => {
      if (withLoading) {
        showLoading(withLoading, forceFullpage)
      } else {
        hideLoading(withLoading, forceFullpage)
      }
    }
  }, [showLoading, hideLoading, withLoading, forceFullpage])
  return <></>
}
