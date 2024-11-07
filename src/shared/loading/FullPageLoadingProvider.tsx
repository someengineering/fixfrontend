import { MutableRefObject, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { env } from 'src/shared/constants'
import { FullPageLoading } from './FullPageLoading'
import { LoadingContext, LoadingStateType } from './LoadingContext'

interface FullPageLoadingContainerProps {
  setLoadingStateRef: MutableRefObject<(loadingState: LoadingStateType, forceFullPage?: boolean) => void>
}

const FullPageLoadingContainer = ({ setLoadingStateRef }: FullPageLoadingContainerProps) => {
  const [loadingState, setLoadingState] = useState<LoadingStateType>(LoadingStateType.SHOW)
  const firstTimeShown = useRef<number | false>()
  const alreadyShown = useRef<boolean>()
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
  useEffect(() => {
    if (firstTimeShown.current === undefined) {
      firstTimeShown.current = window.setTimeout(() => {
        window.setTimeout(function () {
          window.location.reload()
        }, 3_000)
      }, env.loadPageTimeout)
    }
    if (loadingState === LoadingStateType.HIDE && firstTimeShown.current) {
      window.clearTimeout(firstTimeShown.current)
      firstTimeShown.current = false
    }
  }, [loadingState])
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
