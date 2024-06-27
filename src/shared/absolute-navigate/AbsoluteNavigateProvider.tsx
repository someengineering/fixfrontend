import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { NavigateFunction, NavigateOptions, To, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { AbsoluteNavigateInnerProvider } from './AbsoluteNavigateInnerProvider'
import { getHrefObjFromTo } from './getHrefFromTo'

export const AbsoluteNavigateProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()

  const ignorePathChangeOnce = useRef(false)

  const handleNavigate: NavigateFunction = useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        return navigate(to)
      }
      const { hasHash, ...newTo } = getHrefObjFromTo(to)
      if (hasHash) {
        ignorePathChangeOnce.current = true
      }
      return navigate(newTo, options)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    const authenticated = isAuthenticated()
    if (
      authenticated &&
      !ignorePathChangeOnce.current &&
      !location.pathname.startsWith('/auth') &&
      !location.pathname.startsWith('/subscription')
    ) {
      const selectedWorkspaceId = getAuthData()?.selectedWorkspaceId
      if (selectedWorkspaceId !== location.hash?.substring(1)) {
        handleNavigate({ pathname: location.pathname, search: location.search }, { replace: true, state: location.state as unknown })
      }
    }
    ignorePathChangeOnce.current = false
  }, [location.hash, location.pathname, location.search, location.state, handleNavigate])

  return (
    <AbsoluteNavigateInnerProvider useNavigate={handleNavigate} workspaceId={location.hash?.substring(1) ?? ''}>
      {children}
    </AbsoluteNavigateInnerProvider>
  )
}
