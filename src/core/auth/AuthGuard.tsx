import axios, { AxiosError, AxiosInstance } from 'axios'
import { PropsWithChildren, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { GTMEventNames } from 'src/shared/constants'
import { sendToGTM } from 'src/shared/google-tag-manager'
import { GetWorkspaceResponse } from 'src/shared/types/server'
import { axiosWithAuth, defaultAxiosConfig, setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated as isCookieAuthenticated } from 'src/shared/utils/cookie'
import { jsonToStr } from 'src/shared/utils/jsonToStr'
import { getAuthData, setAuthData } from 'src/shared/utils/localstorage'
import { TrackJS } from 'trackjs'
import { UserContext, UserContextRealValues } from './UserContext'
import { getCurrentUserQuery } from './getCurrentUser.query'
import { getPermissions, maxPermissionNumber } from './getPermissions'
import { getWorkspacesQuery } from './getWorkspaces.query'
import { logoutMutation } from './logout.mutation'

const defaultAuth = { isAuthenticated: false, workspaces: [], selectedWorkspace: undefined, currentUser: undefined }

export function AuthGuard({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<UserContextRealValues>(() => {
    const isAuthenticated = isCookieAuthenticated()
    const selectedWorkspaceId = isAuthenticated
      ? window.location.hash?.substring(1) || getAuthData()?.selectedWorkspaceId || undefined
      : undefined
    return {
      ...defaultAuth,
      selectedWorkspace: selectedWorkspaceId
        ? {
            id: selectedWorkspaceId,
            members: [],
            name: '',
            owners: [],
            slug: '',
            created_at: new Date().toISOString(),
            on_hold_since: null,
            trial_end_days: null,
            user_has_access: true,
            user_permissions: maxPermissionNumber,
            permissions: getPermissions(maxPermissionNumber),
          }
        : undefined,
      isAuthenticated,
    }
  })

  const navigate = useAbsoluteNavigate()
  const nextUrl = useRef<string>()

  const handleSetAuth = useCallback((data: SetStateAction<UserContextRealValues> | undefined, url?: string) => {
    if (!data) {
      setAuth(defaultAuth)
    } else {
      setAuth(data)
    }
    nextUrl.current = url
  }, [])

  const handleLogout = useCallback(
    async (noWorkspace?: boolean) => {
      navigate({
        pathname: '/auth/login',
        search: window.location.search.includes('returnUrl')
          ? window.location.search
          : `?returnUrl=${window.encodeURIComponent(window.location.pathname + window.location.search + (noWorkspace ? '' : window.location.hash))}`,
      })
      try {
        await logoutMutation()
      } finally {
        clearAllCookies()
        setAuth(defaultAuth)
      }
    },
    [navigate],
  )

  const handleRefreshWorkspaces = useCallback(async (instance?: AxiosInstance) => {
    try {
      const workspaces = await getWorkspacesQuery(instance ?? axiosWithAuth)
      setAuth((prev) => {
        const selectedWorkspace =
          (prev.selectedWorkspace?.id
            ? workspaces.find((workspace) => workspace.id === prev.selectedWorkspace?.id)
            : workspaces.find((workspace) => workspace.user_has_access && workspace.permissions.includes('read'))) ?? workspaces[0]
        window.setTimeout(() => {
          window.location.hash = selectedWorkspace?.id ?? ''
        })
        return {
          ...prev,
          workspaces,
          selectedWorkspace,
        }
      })
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
    if (auth.isAuthenticated) {
      const instance = axios.create({
        ...defaultAxiosConfig,
        withCredentials: true,
      })
      instance.interceptors.request.use(
        (request) => request,
        (error: AxiosError | Error) => {
          if ((error as AxiosError)?.code !== 'ERR_CANCELED') {
            if (TrackJS.isInstalled()) {
              TrackJS.track(error)
            }
            const { message, name, stack = 'unknown' } = error ?? {}
            const authorized = isCookieAuthenticated()
            const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
            sendToGTM({
              event: GTMEventNames.Error,
              message: jsonToStr(message),
              name: jsonToStr(name),
              stack: jsonToStr(stack),
              workspaceId,
              authorized,
            })
          }
        },
      )
      instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError & { config: { _retry: boolean } | undefined }) => {
          if (error?.response?.status === 401) {
            return handleLogout()
          }
          if ('isAxiosError' in error && error.isAxiosError && error.code !== 'ERR_CANCELED') {
            if (TrackJS.isInstalled()) {
              TrackJS.track(error)
            }
            const { response, name, message, cause, status, stack, config, code } = error
            const request = error.request as unknown
            const authorized = isCookieAuthenticated()
            const workspaceId = getAuthData()?.selectedWorkspaceId || 'unknown'
            sendToGTM({
              event: GTMEventNames.NetworkError,
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
              workspaceId,
              authorized,
            })
          }
          throw error
        },
      )
      setAxiosWithAuth(instance)
      void handleRefreshWorkspaces(instance)
      void getCurrentUserQuery(instance).then((currentUser) => {
        setAuth((prev) => ({ ...prev, currentUser }))
      })
    }
  }, [auth.isAuthenticated, handleRefreshWorkspaces, handleLogout, navigate])

  useEffect(() => {
    setAuthData({
      isAuthenticated: auth.isAuthenticated,
      selectedWorkspaceId: auth.selectedWorkspace?.id,
    })
    if (nextUrl.current && auth.isAuthenticated) {
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
