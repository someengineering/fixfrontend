import axios, { AxiosError, AxiosInstance } from 'axios'
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { GetWorkspaceResponse } from 'src/shared/types/server'
import { axiosWithAuth, defaultAxiosConfig, setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated } from 'src/shared/utils/cookie'
import { jsonToStr } from 'src/shared/utils/jsonToStr'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { UserContext, UserContextRealValues } from './UserContext'
import { getCurrentUserMutation } from './getCurrentUser.mutation'
import { getWorkspacesMutation } from './getWorkspaces.mutation'
import { logoutMutation } from './logout.mutation'

const defaultAuth = { isAuthenticated: false, workspaces: [], selectedWorkspace: undefined, currentUser: undefined }

export function AuthGuard({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<UserContextRealValues>(() => {
    const selectedWorkspaceId = getAuthData()?.selectedWorkspaceId
    return {
      ...defaultAuth,
      selectedWorkspace: selectedWorkspaceId
        ? {
            id: selectedWorkspaceId,
            members: [],
            name: '',
            owners: [],
            slug: '',
          }
        : undefined,
      isAuthenticated: isAuthenticated(),
    }
  })
  const navigate = useAbsoluteNavigate()
  const nextUrl = useRef<string>()

  const handleSetAuth = useCallback((data: UserContextRealValues | undefined, url?: string) => {
    if (!data) {
      setAuth(defaultAuth)
    } else {
      setAuth(data)
    }
    nextUrl.current = url
  }, [])

  const handleLogout = useCallback(async () => {
    navigate({
      pathname: '/auth/login',
      search: window.location.search.includes('returnUrl')
        ? window.location.search
        : `?returnUrl=${window.encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`,
    })
    try {
      await logoutMutation()
    } finally {
      clearAllCookies()
      setAuth(defaultAuth)
    }
  }, [navigate])

  const handleRefreshWorkspaces = useCallback(async (instance?: AxiosInstance) => {
    try {
      const workspaces = await getWorkspacesMutation(instance ?? axiosWithAuth)
      setAuth((prev) => ({
        ...prev,
        workspaces,
        selectedWorkspace: workspaces.find((workspace) => workspace.id === prev.selectedWorkspace?.id) ?? workspaces[0],
      }))
      return workspaces
    } catch {
      setAuth(defaultAuth)
      return undefined
    }
  }, [])

  const handleSelectWorkspaces = useCallback((id: string) => {
    return new Promise<GetWorkspaceResponse | undefined>((resolve) => {
      setAuth((prev) => {
        const foundWorkspace = prev.workspaces.find((item) => item.id === id)
        resolve(foundWorkspace)
        return foundWorkspace
          ? {
              ...prev,
              selectedWorkspace: foundWorkspace,
            }
          : prev
      })
    })
  }, [])

  useEffect(() => {
    if (auth?.isAuthenticated) {
      const instance = axios.create({
        ...defaultAxiosConfig,
        withCredentials: true,
      })
      instance.interceptors.request.use(
        (request) => request,
        (error: AxiosError | Error) => {
          const { message, name, stack = 'unknown' } = error ?? {}
          const authorized = isAuthenticated()
          const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
          sendToGTM({
            event: 'error',
            message: jsonToStr(message),
            name: jsonToStr(name),
            stack: jsonToStr(stack),
            workspaceId,
            authorized,
          })
        },
      )
      instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError & { config: { _retry: boolean } | undefined }) => {
          if (error?.response?.status === 403 || error?.response?.status === 401) {
            return handleLogout()
          }
          if ('isAxiosError' in error && error.isAxiosError) {
            const { response, name, message, cause, status, stack, config, code, toJSON } = error
            const request = error.request as unknown
            const authorized = isAuthenticated()
            const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
            sendToGTM({
              event: 'network-error',
              api: response?.config.url || 'unknown',
              responseData: jsonToStr(response?.data) || '',
              responseHeader: jsonToStr(response?.data) || '',
              responseStatus: jsonToStr(response?.status) || '',
              response: jsonToStr(response),
              request: jsonToStr(request),
              name: jsonToStr(name),
              message: jsonToStr(message),
              cause: jsonToStr(cause),
              status: jsonToStr(status),
              stack: jsonToStr(stack),
              config: jsonToStr(config),
              code: jsonToStr(code),
              rest: jsonToStr(toJSON()),
              workspaceId,
              authorized,
            })
          }
          throw error
        },
      )
      setAxiosWithAuth(instance)
      void handleRefreshWorkspaces(instance)
      void getCurrentUserMutation(instance).then((currentUser) => {
        setAuth((prev) => ({ ...prev, currentUser }))
      })
    }
  }, [auth?.isAuthenticated, handleRefreshWorkspaces, handleLogout])

  useEffect(() => {
    setAuthData({
      isAuthenticated: auth.isAuthenticated,
      selectedWorkspaceId: auth.selectedWorkspace?.id,
    })
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
