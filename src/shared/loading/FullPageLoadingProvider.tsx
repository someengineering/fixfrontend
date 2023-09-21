import { createContext, MutableRefObject, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { FullPageLoading } from './FullPageLoading'

export type LoadingContextValue = {
  showLoading: (halfWidth?: boolean) => void
  hideLoading: () => void
}

export enum LoadingStateType {
  SHOW,
  HIDE,
  HALF_WIDTH,
}

export const LoadingContext = createContext<LoadingContextValue | null>(null)

const FullPageLoadingContainer = ({
  setLoadingStateRef,
}: {
  setLoadingStateRef: MutableRefObject<(loadingState: LoadingStateType) => void>
}) => {
  const [loadingState, setLoadingState] = useState<LoadingStateType>(LoadingStateType.SHOW)
  useEffect(() => {
    setLoadingStateRef.current = (loadingState: LoadingStateType) => {
      setLoadingState(loadingState)
    }
  }, [setLoadingStateRef])
  return <FullPageLoading loadingState={loadingState} />
}

export const FullPageLoadingProvider = ({ children }: PropsWithChildren) => {
  const setLoadingStateRef = useRef((_: LoadingStateType) => {})
  const showLoading = useCallback((halfWidth?: boolean) => {
    setLoadingStateRef.current(halfWidth ? LoadingStateType.HALF_WIDTH : LoadingStateType.SHOW)
  }, [])
  const hideLoading = useCallback(() => {
    setLoadingStateRef.current(LoadingStateType.HIDE)
  }, [])
  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      <FullPageLoadingContainer setLoadingStateRef={setLoadingStateRef} />
      {children}
    </LoadingContext.Provider>
  )
}
