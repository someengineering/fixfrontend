import { Trans } from '@lingui/macro'
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb'
import { Button, Stack } from '@mui/material'
import { PropsWithChildren, memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorModal } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { getAuthData } from 'src/shared/utils/localstorage'
import { UserContext, UserContextValue } from './UserContext'

interface WorkspaceGuardProps extends PropsWithChildren {
  value: UserContextValue
}

export const WorkspaceInnerComp = memo(
  ({ value, children }: WorkspaceGuardProps) => {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
  },
  (prev, next) =>
    prev.value.checkPermission === next.value.checkPermission &&
    prev.value.checkPermissions === next.value.checkPermissions &&
    JSON.stringify(prev.value.currentUser) === JSON.stringify(next.value.currentUser) &&
    prev.value.isAuthenticated === next.value.isAuthenticated &&
    prev.value.logout === next.value.logout &&
    prev.value.refreshWorkspaces === next.value.refreshWorkspaces &&
    prev.value.selectWorkspace === next.value.selectWorkspace &&
    JSON.stringify(prev.value.selectedWorkspace) === JSON.stringify(next.value.selectedWorkspace) &&
    prev.value.setAuth === next.value.setAuth &&
    JSON.stringify(prev.value.workspaces) === JSON.stringify(next.value.workspaces),
)

export const WorkspaceGuard = ({ value, children }: WorkspaceGuardProps) => {
  const location = useLocation()

  const hashWorkspaceId = location.hash?.substring(1)
  const currentWorkspaceId = value.selectedWorkspace?.id

  const hasAccess = value.selectedWorkspace?.user_has_access !== false && value.selectedWorkspace?.permissions.includes('read')

  const persistedLastWorkingWorkspaceId = getAuthData()?.lastWorkingWorkspaceId

  const persistedLastWorkingWorkspace = persistedLastWorkingWorkspaceId
    ? value.workspaces?.find((workspace) => workspace.id === persistedLastWorkingWorkspaceId)
    : undefined

  const defaultWorkspaceId =
    persistedLastWorkingWorkspace &&
    persistedLastWorkingWorkspace.user_has_access !== false &&
    persistedLastWorkingWorkspace.permissions.includes('read')
      ? persistedLastWorkingWorkspace.id
      : value.workspaces?.[0]?.id && value.workspaces[0].user_has_access !== false && value.workspaces[0].permissions.includes('read')
        ? value.workspaces[0].id
        : undefined

  useEffect(() => {
    if (hashWorkspaceId && currentWorkspaceId !== hashWorkspaceId) {
      void value.selectWorkspace(hashWorkspaceId)
    } else if (currentWorkspaceId) {
      window.location.hash = currentWorkspaceId
    }
    if (!hashWorkspaceId) {
      const persistedWorkspaceId = getAuthData()?.selectedWorkspaceId || defaultWorkspaceId
      if (persistedWorkspaceId) {
        void value.selectWorkspace(persistedWorkspaceId)
      }
    }
  }, [hashWorkspaceId, currentWorkspaceId, value, defaultWorkspaceId])

  const isNotInsidePanel = location.pathname.startsWith('/auth') || location.pathname.startsWith('/subscription')

  return !isNotInsidePanel && value.isAuthenticated && (!currentWorkspaceId || !hashWorkspaceId) ? (
    <FullPageLoadingSuspenseFallback />
  ) : hasAccess || isNotInsidePanel || !value.isAuthenticated ? (
    <WorkspaceInnerComp value={value}>{children}</WorkspaceInnerComp>
  ) : (
    <ErrorModal
      errorIcon={<DoNotDisturbIcon color="error" />}
      title={<Trans>You don't have access to this workspace.</Trans>}
      description={<Trans>The workspace you requested cannot be accessed. Please request access from the workspace administrator.</Trans>}
      actions={
        <>
          <Stack justifySelf="start" mb={{ xs: 1, sm: 0 }} mr={{ xs: 1, sm: 0 }}>
            <Button
              variant={defaultWorkspaceId ? 'contained' : 'outlined'}
              color={defaultWorkspaceId ? 'primary' : 'warning'}
              onClick={() => {
                if (defaultWorkspaceId) {
                  void value.selectWorkspace(defaultWorkspaceId)
                } else {
                  void value.logout()
                }
              }}
            >
              {defaultWorkspaceId ? <Trans>Ok</Trans> : <Trans>Log Out</Trans>}
            </Button>
          </Stack>
        </>
      }
    />
  )
}
