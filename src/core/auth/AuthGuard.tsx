import axios, { AxiosError, AxiosInstance } from 'axios'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { env } from 'src/shared/constants'
import { GetOrganizationResponse } from 'src/shared/types/server'
import { axiosWithAuth, setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { UserContext, UserContextRealValues, useUserProfile } from './UserContext'
import { getOrganizationMutation } from './getOrganization.mutation'
import { logoutMutation } from './logout.mutation'

export interface RequireAuthProps {}

export function RequireAuth() {
  const location = useLocation()
  const user = useUserProfile()

  if (!user.isAuthenticated) {
    return (
      <Navigate to={{ pathname: '/auth/login', search: `returnUrl=${location.pathname}${encodeURIComponent(location.search)}` }} replace />
    )
  }

  return <Outlet />
}

export interface AuthGuardProps {}

export function AuthGuard({ children }: PropsWithChildren<AuthGuardProps>) {
  const [auth, setAuth] = useState<UserContextRealValues | undefined>({
    ...(getAuthData() || {}),
    isAuthenticated: isAuthenticated() as false,
    organizations: [],
    selectedOrganization: undefined,
  })
  const navigate = useNavigate()
  const nextUrl = useRef<string>()

  const handleSetAuth = useCallback((data: UserContextRealValues | undefined, url?: string) => {
    setAuth(data)
    nextUrl.current = url
  }, [])

  const handleLogout = useCallback(() => {
    logoutMutation().finally(() => {
      clearAllCookies()
      setAuth({ isAuthenticated: false, organizations: [], selectedOrganization: undefined })
    })
  }, [])

  const handleRefreshOrganizations = useCallback((instance?: AxiosInstance) => {
    return getOrganizationMutation(instance ?? axiosWithAuth).then((data) => {
      setAuth({ isAuthenticated: true, organizations: data, selectedOrganization: data[0] })
      return data
    })
  }, [])

  const handleSelectOrganizations = useCallback((id: string) => {
    return new Promise<GetOrganizationResponse | undefined>((resolve) => {
      setAuth((prev) => {
        const foundOrganization = prev?.organizations.find((item) => item.id === id)
        resolve(foundOrganization)
        return foundOrganization
          ? {
              isAuthenticated: prev?.isAuthenticated ?? foundOrganization ? true : false,
              organizations: prev?.organizations ?? [],
              selectedOrganization: foundOrganization,
            }
          : prev
      })
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
            setAuth({ isAuthenticated: false, organizations: [] })
          }
          throw error
        },
      )
      setAxiosWithAuth(instance)
      handleRefreshOrganizations(instance)
    }
  }, [auth?.isAuthenticated, handleRefreshOrganizations])

  useEffect(() => {
    setAuthData(auth)
    if (nextUrl.current && auth?.isAuthenticated) {
      navigate(nextUrl.current, { replace: true })
      nextUrl.current = undefined
    }
  }, [auth, navigate])

  return (
    <UserContext.Provider
      value={{
        ...auth,
        setAuth: handleSetAuth,
        logout: handleLogout,
        refreshOrganizations: handleRefreshOrganizations,
        selectOrganization: handleSelectOrganizations,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
