import { Outlet, useLocation } from 'react-router-dom'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { useUserProfile } from './useUserProfile'

export function RequireAuth() {
  const navigate = useAbsoluteNavigate()
  const location = useLocation()
  const user = useUserProfile()

  if (!user.isAuthenticated && location.pathname !== '/auth/login') {
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
    return null
  }

  return <Outlet />
}
