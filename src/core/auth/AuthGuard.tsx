import axios, { AxiosError } from 'axios'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authResponseToContext } from 'src/shared/utils/authResponseToContext'
import { setAxiosWithAuth } from 'src/shared/utils/axios'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { refreshTokenMutation } from './refreshToken.mutation'
import { UserContext, UserContextRealValues, useUserProfile } from './UserContext'

export interface RequireAuthProps {}

export function RequireAuth() {
  const user = useUserProfile()
  const location = useLocation()

  if (!user.token) {
    return <Navigate to={{ pathname: '/login', search: `returnUrl=${location.pathname}${encodeURIComponent(location.search)}` }} replace />
  }

  return <Outlet />
}

const handleRefreshToken = async (token: string) => {
  try {
    const accessToken = await refreshTokenMutation(token)

    if (accessToken) {
      return authResponseToContext(accessToken)
    }
  } catch {}
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
    if (auth?.token) {
      const instance = axios.create({
        baseURL: '/',
        headers: {
          Authorization: `${auth.tokenType} ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      instance.interceptors.request.use(async (config) => {
        if (auth.token && auth.tokenExpireTimestamp && auth.tokenExpireTimestamp <= new Date().getTime()) {
          const response = await handleRefreshToken(auth.token)
          if (response) {
            setAuth((prevAuth) => ({
              ...prevAuth,
              ...response,
            }))
            config.headers.Authorization = `${response.tokenType} ${response.token}`
            instance.defaults.headers.common.Authorization = `${response.tokenType} ${response.token}`
          } else {
            setAuth(undefined)
            throw new Error('Could not refresh token', {
              cause: 'Could not refresh token',
            })
          }
        }
        return config
      })
      instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError & { config: { _retry: boolean } | undefined }) => {
          const originalRequest = error.config ?? { headers: { Authorization: '' }, _retry: false }
          if ((error?.response?.status === 403 || error?.response?.status === 401) && !originalRequest._retry && auth.token) {
            originalRequest._retry = true
            const response = await handleRefreshToken(auth.token)
            if (response) {
              setAuth((prevAuth) => ({
                ...prevAuth,
                ...response,
              }))
              originalRequest.headers.Authorization = `${response.tokenType} ${response.token}`
              instance.defaults.headers.common.Authorization = `${response.tokenType} ${response.token}`

              return instance(originalRequest)
            } else {
              setAuth(undefined)
              throw new Error('Could not refresh token', {
                cause: 'Could not refresh token',
              })
            }
          } else if (error?.response?.status === 403 || error?.response?.status === 401) {
            setAuth(undefined)
          }
          throw error
        },
      )
      setAxiosWithAuth(instance)
    }
  }, [auth?.token, auth?.tokenType, auth?.tokenExpireTimestamp])

  useEffect(() => {
    setAuthData(auth)
    if (nextUrl.current && auth?.token) {
      navigate(nextUrl.current, { replace: true })
      nextUrl.current = undefined
    }
  }, [auth, navigate])

  return <UserContext.Provider value={{ ...auth, setAuth: handleSetAuth }}>{children}</UserContext.Provider>
}
