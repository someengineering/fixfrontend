import axios, { AxiosError, AxiosInstance } from 'axios'
import { usePostHog } from 'posthog-js/react'
import { PropsWithChildren, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { PostHogEvent } from 'src/shared/posthog'
import { GetWorkspaceResponse } from 'src/shared/types/server'
import { axiosWithAuth, defaultAxiosConfig, setAxiosWithAuth } from 'src/shared/utils/axios'
import { clearAllCookies, isAuthenticated as isCookieAuthenticated } from 'src/shared/utils/cookie'
import { getAuthData as getPersistedAuthData, setAuthData as setPersistedAuthData } from 'src/shared/utils/localstorage'
import { UserContextRealValues, UserContextValue } from './UserContext'
import { WorkspaceGuard } from './WorkspaceGuard'
import { getCurrentUserQuery } from './getCurrentUser.query'
import { Permissions, getPermissions, maxPermissionNumber } from './getPermissions'
import { getWorkspacesQuery } from './getWorkspaces.query'
import { logoutMutation } from './logout.mutation'

const defaultAuth = { isAuthenticated: false, workspaces: [], selectedWorkspace: undefined, currentUser: undefined }

export function AuthGuard({ children }: PropsWithChildren) {
  const postHog = usePostHog()
  const [auth, setAuth] = useState<UserContextRealValues>(() => {
    const isAuthenticated = isCookieAuthenticated()
    const selectedWorkspaceId = isAuthenticated ? getPersistedAuthData()?.selectedWorkspaceId : undefined

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
            move_to_free_acknowledged_at: new Date().toISOString(),
            tier: 'Free',
            user_has_access: true,
            user_permissions: maxPermissionNumber,
            permissions: getPermissions(maxPermissionNumber),
          }
        : undefined,
      isAuthenticated,
    }
  })
  const [isFetching, setIsFetching] = useState(false)

  const handleInternalSetAuth = useCallback((value: SetStateAction<UserContextRealValues>) => {
    setAuth((prev) => {
      const newAuth = typeof value === 'function' ? value(prev) : value
      const selectedWorkspaceId = newAuth.selectedWorkspace?.id ?? prev.selectedWorkspace?.id
      setPersistedAuthData({
        isAuthenticated: newAuth.isAuthenticated,
        lastWorkingWorkspaceId: newAuth.workspaces.find((workspace) => workspace.id === newAuth.selectedWorkspace?.id)
          ? selectedWorkspaceId
          : prev.selectedWorkspace?.id,
        selectedWorkspaceId,
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
      postHog.reset()
      clearAllCookies()
      handleInternalSetAuth(defaultAuth)
      try {
        await logoutMutation()
      } catch {
        /* empty */
      }
    },
    [handleInternalSetAuth, navigate, postHog],
  )

  const handleRefreshWorkspaces = useCallback(
    async (instance?: AxiosInstance, _internalFetch?: boolean) => {
      if (!_internalFetch) {
        setIsFetching(true)
      }
      try {
        const workspaces = await getWorkspacesQuery(instance ?? axiosWithAuth)
        handleInternalSetAuth((prev) => {
          const prevSelectedWorkspaceId = prev.selectedWorkspace?.id
          return {
            ...prev,
            workspaces,
            selectedWorkspace: prevSelectedWorkspaceId
              ? workspaces.find((workspace) => workspace.id === prevSelectedWorkspaceId)
              : prev.selectedWorkspace,
          }
        })
        if (!_internalFetch) {
          setIsFetching(false)
        }
        return workspaces
      } catch {
        handleInternalSetAuth(defaultAuth)
        if (!_internalFetch) {
          setIsFetching(false)
        }
        return undefined
      }
    },
    [handleInternalSetAuth],
  )

  useEffect(() => {
    if (auth.currentUser) {
      postHog.identify(auth.currentUser.id, { ...auth.currentUser })
    }
  }, [auth.currentUser, postHog])

  useEffect(() => {
    if (auth.selectedWorkspace?.id) {
      postHog.group('workspace_id', auth.selectedWorkspace.id)
    }
  }, [auth.selectedWorkspace?.id, postHog])

  const handleSelectWorkspace = useCallback(
    (id: string) => {
      return new Promise<GetWorkspaceResponse | undefined>((resolve) => {
        handleInternalSetAuth((prev) => {
          const foundWorkspace = prev.workspaces.find((item) => item.id === id)
          resolve(foundWorkspace)

          return {
            ...prev,
            selectedWorkspace: foundWorkspace ?? {
              created_at: '',
              id,
              members: [],
              name: '',
              on_hold_since: null,
              owners: [],
              permissions: [],
              slug: '',
              trial_end_days: null,
              move_to_free_acknowledged_at: new Date().toISOString(),
              tier: 'Free',
              user_has_access: null,
              user_permissions: 0,
            },
          }
        })
      })
    },
    [handleInternalSetAuth],
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
              const data = (error as AxiosError)?.response?.data
              if (data) {
                window.TrackJS.console.info(data)
              }
              window.TrackJS.track(error)
            }
            postHog.capture(PostHogEvent.Error, {
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
              window.TrackJS.console.info(error.response?.data ?? 'no data from server')
              window.TrackJS.track(error)
            }
            postHog.capture(PostHogEvent.NetworkError, {
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
      setIsFetching(true)
      void Promise.all([
        handleRefreshWorkspaces(instance, true),
        getCurrentUserQuery(instance).then((currentUser) => {
          handleInternalSetAuth((prev) => ({ ...prev, currentUser }))
        }),
      ]).finally(() => setIsFetching(false))
    }
  }, [auth.isAuthenticated, handleRefreshWorkspaces, handleLogout, handleInternalSetAuth, postHog])

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

  return isFetching ? (
    <FullPageLoadingSuspenseFallback forceFullPage />
  ) : (
    <WorkspaceGuard
      value={{
        ...auth,
        setAuth: handleSetAuth,
        logout: handleLogout,
        refreshWorkspaces: handleRefreshWorkspaces,
        selectWorkspace: handleSelectWorkspace,
        checkPermission: handleCheckPermission,
        checkPermissions: handleCheckPermissions as UserContextValue['checkPermissions'],
      }}
    >
      {children}
    </WorkspaceGuard>
  )
}
