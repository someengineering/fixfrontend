import axios, { AxiosError } from 'axios'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { env } from 'src/shared/constants'
import { setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { logoutMutation } from './logout.mutation'
import { UserContext, UserContextRealValues, useUserProfile } from './UserContext'

export interface RequireAuthProps {}

export function RequireAuth() {
  const location = useLocation()
  const user = useUserProfile()

  if (!user.isAuthenticated) {
    return <Navigate to={{ pathname: '/login', search: `returnUrl=${location.pathname}${encodeURIComponent(location.search)}` }} replace />
  }

  return <Outlet />
}

export interface AuthGuardProps {}

export function AuthGuard({ children }: PropsWithChildren<AuthGuardProps>) {
  const [auth, setAuth] = useState<UserContextRealValues | undefined>({ ...(getAuthData() || {}), isAuthenticated: isAuthenticated() })
  const navigate = useNavigate()
  const nextUrl = useRef<string>()

  const handleSetAuth = useCallback((data: UserContextRealValues | undefined, url?: string) => {
    setAuth(data)
    nextUrl.current = url
  }, [])

  const handleLogout = useCallback(() => {
    logoutMutation().finally(() => {
      clearAllCookies()
      setAuth({ isAuthenticated: false })
    })
  }, [])

  useEffect(() => {
    if (auth?.isAuthenticated) {
      const instance = axios.create({
        baseURL: env.apiUrl,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError & { config: { _retry: boolean } | undefined }) => {
          if (error?.response?.status === 403 || error?.response?.status === 401) {
            setAuth(undefined)
            throw new Error('Could not refresh token', {
              cause: 'Could not refresh token',
            })
          } else if (error?.response?.status === 403 || error?.response?.status === 401) {
            setAuth({ isAuthenticated: false })
          }
          throw error
        },
      )
      setAxiosWithAuth(instance)
    }
  }, [auth?.isAuthenticated])

  useEffect(() => {
    setAuthData(auth)
    if (nextUrl.current && auth?.isAuthenticated) {
      navigate(nextUrl.current, { replace: true })
      nextUrl.current = undefined
    }
  }, [auth, navigate])

  return <UserContext.Provider value={{ ...auth, setAuth: handleSetAuth, logout: handleLogout }}>{children}</UserContext.Provider>
}
