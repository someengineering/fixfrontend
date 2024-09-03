import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { AbsoluteNavigateInnerProvider } from './AbsoluteNavigateInnerProvider'
import { getHrefObjFromTo } from './getHrefFromTo'

const removeHash = () =>
  window.history.replaceState(window.history.state, window.document.title, window.location.pathname + window.location.search)

export const AbsoluteNavigateProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()

  const shouldRemoveHash = useRef(false)
  const ignorePathChangeOnce = useRef(false)

  const handleNavigate = useCallback<NavigateFunction>(
    ((to, options) => {
      if (typeof to === 'number') {
        return navigate(to)
      }
      const { hasHash, ...newTo } = getHrefObjFromTo(to)
      if (hasHash) {
        ignorePathChangeOnce.current = true
      }
      if (!newTo.hash) {
        delete newTo.hash
        shouldRemoveHash.current = true
      }
      return navigate(newTo, options)
    }) as NavigateFunction,
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
    if (shouldRemoveHash.current) {
      shouldRemoveHash.current = false
      window.setTimeout(removeHash)
    }
  }, [location.hash, location.pathname, location.search, location.state, handleNavigate])

  return (
    <AbsoluteNavigateInnerProvider useNavigate={handleNavigate} workspaceId={location.hash?.substring(1) ?? ''}>
      {children}
    </AbsoluteNavigateInnerProvider>
  )
}
