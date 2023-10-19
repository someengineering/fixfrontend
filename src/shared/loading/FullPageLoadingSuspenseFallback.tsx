import { useEffect } from 'react'
import { useFullPageLoading } from './useFullPageLoading'

export interface FullPageLoadingSuspenseFallbackProps {
  forceFullpage?: boolean
}

export const FullPageLoadingSuspenseFallback = ({ forceFullpage }: FullPageLoadingSuspenseFallbackProps) => {
  const { hideLoading, showLoading } = useFullPageLoading()
  useEffect(() => {
    showLoading(forceFullpage)
    return () => {
      hideLoading(forceFullpage)
    }
  }, [showLoading, hideLoading, forceFullpage])
  return <></>
}
