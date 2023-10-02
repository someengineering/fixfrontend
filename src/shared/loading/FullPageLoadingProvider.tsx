import { createContext, MutableRefObject, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { FullPageLoading } from './FullPageLoading'

export type LoadingContextValue = {
  showLoading: (halfWidth?: boolean, forceFullpage?: boolean) => void
  hideLoading: (halfWidth?: boolean, forceFullpage?: boolean) => void
}

export enum LoadingStateType {
  SHOW,
  SHOW_NO_BACKGROUND,
  HIDE,
  HALF_WIDTH,
}

export const LoadingContext = createContext<LoadingContextValue | null>(null)

const FullPageLoadingContainer = ({
  setLoadingStateRef,
}: {
  setLoadingStateRef: MutableRefObject<(loadingState: LoadingStateType, forceFullpage?: boolean) => void>
}) => {
  const [loadingState, setLoadingState] = useState<LoadingStateType>(LoadingStateType.SHOW)
  const alreadyShown = useRef<boolean | undefined>(undefined)
  useEffect(() => {
    setLoadingStateRef.current = (loadingStateToSet: LoadingStateType, forceFullpage?: boolean) => {
      setLoadingState(
        alreadyShown.current && loadingStateToSet === LoadingStateType.SHOW && !forceFullpage
          ? LoadingStateType.SHOW_NO_BACKGROUND
          : loadingStateToSet,
      )
      if (alreadyShown.current === undefined) {
        alreadyShown.current = false
      } else if (!alreadyShown.current) {
        alreadyShown.current = true
      }
    }
  }, [setLoadingStateRef])
  return <FullPageLoading loadingState={loadingState} />
}

export const FullPageLoadingProvider = ({ children }: PropsWithChildren) => {
  const setLoadingStateRef = useRef((_: LoadingStateType, __?: boolean) => {})
  const shownLoadings = useRef<LoadingStateType[]>([])
  const showLoading = useCallback((halfWidth?: boolean, forceFullpage?: boolean) => {
    const state = halfWidth ? LoadingStateType.HALF_WIDTH : LoadingStateType.SHOW
    shownLoadings.current.push(state)
    setLoadingStateRef.current(state, forceFullpage)
  }, [])
  const hideLoading = useCallback((halfWidth?: boolean, forceFullpage?: boolean) => {
    const hidingState = halfWidth ? LoadingStateType.HALF_WIDTH : LoadingStateType.SHOW
    shownLoadings.current.splice(
      shownLoadings.current.findIndex((state) => state === hidingState),
      1,
    )
    if (!shownLoadings.current.length) {
      setLoadingStateRef.current(LoadingStateType.HIDE, forceFullpage)
    } else if (shownLoadings.current.includes(LoadingStateType.HALF_WIDTH)) {
      setLoadingStateRef.current(LoadingStateType.HALF_WIDTH, forceFullpage)
    } else {
      setLoadingStateRef.current(LoadingStateType.SHOW, forceFullpage)
    }
  }, [])
  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      <FullPageLoadingContainer setLoadingStateRef={setLoadingStateRef} />
      {children}
    </LoadingContext.Provider>
  )
}
