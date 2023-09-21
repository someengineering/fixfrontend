import axios, { AxiosError } from 'axios'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { StorageKeys } from 'src/shared/constants'
import { setAxiosWithAuth } from 'src/shared/utils/axios'
import { cookieMatch } from 'src/shared/utils/cookieMatch'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { UserContext, UserContextRealValues } from './UserContext'

export interface RequireAuthProps {}

export function RequireAuth() {
  const location = useLocation()

  if (!cookieMatch(StorageKeys.authenticated, '1')) {
    return <Navigate to={{ pathname: '/login', search: `returnUrl=${location.pathname}${encodeURIComponent(location.search)}` }} replace />
  }

  return <Outlet />
}

export interface AuthGuardProps {}

export function AuthGuard({ children }: PropsWithChildren<AuthGuardProps>) {
  const [auth, setAuth] = useState(getAuthData)
  const navigate = useNavigate()
  const nextUrl = useRef<string>()

  const handleSetAuth = useCallback((data: UserContextRealValues | undefined, url?: string) => {
    setAuth(data)
    nextUrl.current = url
  }, [])

  useEffect(() => {
    if (auth?.isAuthenticated) {
      const instance = axios.create({
        baseURL: '/',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
            setAuth(undefined)
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

  return <UserContext.Provider value={{ ...auth, setAuth: handleSetAuth }}>{children}</UserContext.Provider>
}
