import { MutableRefObject, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { FullPageLoading } from './FullPageLoading'
import { LoadingContext, LoadingStateType } from './LoadingContext'

interface FullPageLoadingContainerProps {
  setLoadingStateRef: MutableRefObject<(loadingState: LoadingStateType, forceFullPage?: boolean) => void>
}

const FullPageLoadingContainer = ({ setLoadingStateRef }: FullPageLoadingContainerProps) => {
  const [loadingState, setLoadingState] = useState<LoadingStateType>(LoadingStateType.SHOW)
  const alreadyShown = useRef<boolean | undefined>(undefined)
  useEffect(() => {
    setLoadingStateRef.current = (loadingStateToSet: LoadingStateType, forceFullPage?: boolean) => {
      setLoadingState(
        alreadyShown.current && loadingStateToSet === LoadingStateType.SHOW && !forceFullPage
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
  const showLoading = useCallback((forceFullPage?: boolean) => {
    const state = LoadingStateType.SHOW
    shownLoadings.current.push(state)
    setLoadingStateRef.current(state, forceFullPage)
  }, [])
  const hideLoading = useCallback((forceFullPage?: boolean) => {
    const hidingState = LoadingStateType.SHOW
    shownLoadings.current.splice(
      shownLoadings.current.findIndex((state) => state === hidingState),
      1,
    )
    if (!shownLoadings.current.length) {
      setLoadingStateRef.current(LoadingStateType.HIDE, forceFullPage)
    } else {
      setLoadingStateRef.current(LoadingStateType.SHOW, forceFullPage)
    }
  }, [])
  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      <FullPageLoadingContainer setLoadingStateRef={setLoadingStateRef} />
      {children}
    </LoadingContext.Provider>
  )
}
