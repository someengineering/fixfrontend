import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { NavigateFunction, NavigateOptions, To, useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData } from 'src/shared/utils/localstorage'
import { AbsoluteNavigateInnerProvider } from './AbsoluteNavigateInnerProvider'
import { handleRelationalPathname } from './handleRelationalPathname'

export const AbsoluteNavigateProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()

  const ignorePathChangeOnce = useRef(false)

  const handleNavigate: NavigateFunction = useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        return navigate(to)
      }
      const selectedWorkspaceId = getAuthData()?.selectedWorkspaceId
      if (typeof to === 'object') {
        const newTo = {
          ...to,
          pathname: to.pathname ? handleRelationalPathname(to.pathname) : undefined,
          hash: to.hash ?? (selectedWorkspaceId ? `#${selectedWorkspaceId}` : undefined),
        }
        if (to.hash) {
          ignorePathChangeOnce.current = true
        }
        return navigate(newTo, options)
      }
      const hashSplitted = to.split('#')
      const hash = (hashSplitted[1] ? `#${hashSplitted[1]}` : undefined) ?? (selectedWorkspaceId ? `#${selectedWorkspaceId}` : '')
      if (hashSplitted[1]) {
        ignorePathChangeOnce.current = true
      }
      const searchSplitted = hashSplitted[0].split('?')
      const search = searchSplitted[1] ? `?${searchSplitted[1]}` : ''
      const pathname = handleRelationalPathname(searchSplitted[0])
      return navigate(`${pathname}${search}${hash}`, options)
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
      if (selectedWorkspaceId !== location.hash.substring(1)) {
        handleNavigate({ pathname: location.pathname, search: location.search }, { replace: true, state: location.state as unknown })
      }
    }
    ignorePathChangeOnce.current = false
  }, [location.hash, location.pathname, location.search, location.state, handleNavigate])

  return <AbsoluteNavigateInnerProvider useNavigate={handleNavigate}>{children}</AbsoluteNavigateInnerProvider>
}
