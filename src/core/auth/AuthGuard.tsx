import axios, { AxiosError, AxiosInstance } from 'axios'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { env } from 'src/shared/constants'
import { GetWorkspaceResponse } from 'src/shared/types/server'
import { axiosWithAuth, setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { UserContext, UserContextRealValues, useUserProfile } from './UserContext'
import { getWorkspacesMutation } from './getWorkspaces.mutation'
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
    workspaces: [],
    selectedWorkspace: undefined,
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
      setAuth({ isAuthenticated: false, workspaces: [], selectedWorkspace: undefined })
    })
  }, [])

  const handleRefreshWorkspaces = useCallback((instance?: AxiosInstance) => {
    return getWorkspacesMutation(instance ?? axiosWithAuth)
      .then((data) => {
        setAuth({ isAuthenticated: true, workspaces: data, selectedWorkspace: data[0] })
        return data
      })
      .catch(() => {
        setAuth({ isAuthenticated: false, workspaces: [] })
        return undefined
      })
  }, [])

  const handleSelectWorkspaces = useCallback((id: string) => {
    return new Promise<GetWorkspaceResponse | undefined>((resolve) => {
      setAuth((prev) => {
        const foundWorkspace = prev?.workspaces.find((item) => item.id === id)
        resolve(foundWorkspace)
        return foundWorkspace
          ? {
              isAuthenticated: prev?.isAuthenticated ?? foundWorkspace ? true : false,
              workspaces: prev?.workspaces ?? [],
              selectedWorkspace: foundWorkspace,
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
            setAuth({ isAuthenticated: false, workspaces: [] })
          }
          handleLogout()
        },
      )
      setAxiosWithAuth(instance)
      handleRefreshWorkspaces(instance)
    }
  }, [auth?.isAuthenticated, handleRefreshWorkspaces, handleLogout])

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
        refreshWorkspaces: handleRefreshWorkspaces,
        selectWorkspace: handleSelectWorkspaces,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
