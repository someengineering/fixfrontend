import { Outlet, useLocation } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { useUserProfile } from './useUserProfile'

interface RequireAuthProps {
  reverse?: boolean
}

export function RequireAuth({ reverse }: RequireAuthProps) {
  const navigate = useAbsoluteNavigate()
  const location = useLocation()
  const { isAuthenticated } = useUserProfile()

  if (!isAuthenticated && !reverse) {
    if (!location.pathname.includes('/auth')) {
      window.setTimeout(() => {
        navigate(
          {
            pathname: '/auth/login',
            search: location.search.includes('returnUrl')
              ? location.search
              : `returnUrl=${window.encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`,
          },
          { replace: true },
        )
      })
    }
    return null
  } else if (reverse && isAuthenticated) {
    if (location.pathname.includes('/auth')) {
      window.setTimeout(() => {
        navigate(window.decodeURIComponent(location.search?.split('returnUrl=')[1]?.split('&')[0] ?? panelUI.homePage), { replace: true })
      })
    }
    return null
  }

  return <Outlet />
}
