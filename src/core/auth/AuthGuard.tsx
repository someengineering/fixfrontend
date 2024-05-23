import axios, { AxiosError, AxiosInstance } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { PropsWithChildren, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { PosthogEvent } from 'src/shared/constants'
import { GetWorkspaceResponse } from 'src/shared/types/server'
import { axiosWithAuth, defaultAxiosConfig, setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated as isCookieAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData as getPersistedAuthData, setAuthData as setPersistedAuthData } from 'src/shared/utils/localstorage'
import { UserContext, UserContextRealValues, UserContextValue } from './UserContext'
import { getCurrentUserQuery } from './getCurrentUser.query'
import { Permissions, getPermissions, maxPermissionNumber } from './getPermissions'
import { getWorkspacesQuery } from './getWorkspaces.query'
import { logoutMutation } from './logout.mutation'

const defaultAuth = { isAuthenticated: false, workspaces: [], selectedWorkspace: undefined, currentUser: undefined }

export function AuthGuard({ children }: PropsWithChildren) {
  const posthog = usePostHog()
  const [auth, setAuth] = useState<UserContextRealValues>(() => {
    const isAuthenticated = isCookieAuthenticated()
    const selectedWorkspaceId = isAuthenticated
      ? window.location.hash?.substring(1) || getPersistedAuthData()?.selectedWorkspaceId || undefined
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

  const handleInternalSetAuth = useCallback((value: SetStateAction<UserContextRealValues>) => {
    setAuth((prev) => {
      const newAuth = typeof value === 'function' ? value(prev) : value
      setPersistedAuthData({
        isAuthenticated: newAuth.isAuthenticated,
        selectedWorkspaceId: newAuth.selectedWorkspace?.id ?? prev.selectedWorkspace?.id,
      })
      return newAuth
    })
  }, [])

  const navigate = useAbsoluteNavigate()
  const nextUrl = useRef<string>()

  const handleSetAuth = useCallback(
    (data: SetStateAction<UserContextRealValues> | undefined, url?: string) => {
      if (!data) {
        handleInternalSetAuth(defaultAuth)
      } else {
        handleInternalSetAuth(data)
      }
      nextUrl.current = url
    },
    [handleInternalSetAuth],
  )

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
        posthog.reset()
        clearAllCookies()
        handleInternalSetAuth(defaultAuth)
      }
    },
    [handleInternalSetAuth, navigate, posthog],
  )

  const handleRefreshWorkspaces = useCallback(
    async (instance?: AxiosInstance) => {
      try {
        const workspaces = await getWorkspacesQuery(instance ?? axiosWithAuth)
        handleInternalSetAuth((prev) => {
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
        handleInternalSetAuth(defaultAuth)
        return undefined
      }
    },
    [handleInternalSetAuth],
  )

  const handleSelectWorkspaces = useCallback(
    (id: string) => {
      return new Promise<GetWorkspaceResponse | undefined>((resolve) => {
        handleInternalSetAuth((prev) => {
          const foundWorkspace = prev.workspaces.find((item) => item.id === id)
          resolve(foundWorkspace)

          if (foundWorkspace) {
            posthog.group('workspace_id', foundWorkspace.id)
          }

          return foundWorkspace
            ? {
                ...prev,
                selectedWorkspace: foundWorkspace,
              }
            : prev
        })
      })
    },
    [handleInternalSetAuth, posthog],
  )

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
            if (window.TrackJS?.isInstalled()) {
              window.TrackJS.track(error)
            }
            posthog.capture(PosthogEvent.Error, {
              authenticated: isCookieAuthenticated(),
              workspace_id: getPersistedAuthData()?.selectedWorkspaceId || undefined,
              error_name: error.name,
              error_message: error.message,
              error_stack: error.stack,
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
            if (window.TrackJS?.isInstalled()) {
              window.TrackJS.track(error)
            }
            posthog.capture(PosthogEvent.NetworkError, {
              authenticated: isCookieAuthenticated(),
              workspace_id: getPersistedAuthData()?.selectedWorkspaceId || undefined,
              api_endpoint: error.response?.config.url || undefined,
              error_response: error.response ? JSON.stringify(error.response) : undefined,
              error_name: error.name,
              error_message: error.message,
              error_status: error.status,
              error_stack: error.stack,
              error_code: error.code,
              error_cause: error.cause ? JSON.stringify(error.cause) : undefined,
              error_config: error.config ? JSON.stringify(error.config) : undefined,
            })
          }
          throw error
        },
      )
      setAxiosWithAuth(instance)
      void handleRefreshWorkspaces(instance)
      void getCurrentUserQuery(instance).then((currentUser) => {
        handleInternalSetAuth((prev) => ({ ...prev, currentUser }))
      })
    }
  }, [auth.isAuthenticated, handleRefreshWorkspaces, handleLogout, navigate, handleInternalSetAuth, posthog])

  useEffect(() => {
    if (nextUrl.current && auth.isAuthenticated) {
      navigate(nextUrl.current, { replace: true })
      nextUrl.current = undefined
    }
  }, [auth, navigate])

  const handleCheckPermission = useCallback(
    (permission: Permissions) => {
      return auth.selectedWorkspace?.permissions.includes(permission) ?? false
    },
    [auth.selectedWorkspace?.permissions],
  )

  const handleCheckPermissions = useCallback(
    (...permission: Permissions[]) => permission.map((permission) => handleCheckPermission(permission)),
    [handleCheckPermission],
  )

  return (
    <UserContext.Provider
      value={{
        ...auth,
        setAuth: handleSetAuth,
        logout: handleLogout,
        refreshWorkspaces: handleRefreshWorkspaces,
        selectWorkspace: handleSelectWorkspaces,
        checkPermission: handleCheckPermission,
        checkPermissions: handleCheckPermissions as UserContextValue['checkPermissions'],
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
