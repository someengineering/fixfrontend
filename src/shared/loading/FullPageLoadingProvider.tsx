import { createContext, MutableRefObject, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { FullPageLoading } from './FullPageLoading'

export type LoadingContextValue = {
  showLoading: (forceFullpage?: boolean) => void
  hideLoading: (forceFullpage?: boolean) => void
}

export enum LoadingStateType {
  SHOW,
  SHOW_NO_BACKGROUND,
  HIDE,
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
  const setLoadingStateRef = useRef((_: LoadingStateType, __?: boolean) => {
    return
  })
  const shownLoadings = useRef<LoadingStateType[]>([])
  const showLoading = useCallback((forceFullpage?: boolean) => {
    const state = LoadingStateType.SHOW
    shownLoadings.current.push(state)
    setLoadingStateRef.current(state, forceFullpage)
  }, [])
  const hideLoading = useCallback((forceFullpage?: boolean) => {
    const hidingState = LoadingStateType.SHOW
    shownLoadings.current.splice(
      shownLoadings.current.findIndex((state) => state === hidingState),
      1,
    )
    if (!shownLoadings.current.length) {
      setLoadingStateRef.current(LoadingStateType.HIDE, forceFullpage)
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
