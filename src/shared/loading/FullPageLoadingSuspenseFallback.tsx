import { useEffect } from 'react'
import { useFullPageLoading } from './useFullPageLoading'

export interface FullPageLoadingSuspenseFallbackProps {
  withLoading?: boolean
}

export const FullPageLoadingSuspenseFallback = ({ withLoading }: FullPageLoadingSuspenseFallbackProps) => {
  const { hideLoading, showLoading } = useFullPageLoading()
  useEffect(() => {
    showLoading()
    return () => {
      if (withLoading) {
        showLoading(withLoading)
      } else {
        hideLoading()
      }
    }
  }, [showLoading, hideLoading, withLoading])
  return <></>
}
