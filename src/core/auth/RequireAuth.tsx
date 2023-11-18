import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUserProfile } from './useUserProfile'

export function RequireAuth() {
  const location = useLocation()
  const user = useUserProfile()

  if (!user.isAuthenticated) {
    return (
      <Navigate
        to={{
          pathname: '/auth/login',
          search: `returnUrl=${window.encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`,
        }}
        replace
      />
    )
  }

  return <Outlet />
}
