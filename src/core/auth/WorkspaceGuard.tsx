import { Trans } from '@lingui/macro'
import NotAccessibleIcon from '@mui/icons-material/NotAccessible'
import { Button, Stack } from '@mui/material'
import { PropsWithChildren, memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorModal } from 'src/shared/error-boundary-fallback'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
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

  useEffect(() => {
    if (currentWorkspaceId !== hashWorkspaceId) {
      void value.selectWorkspace(hashWorkspaceId)
    }
  }, [hashWorkspaceId, currentWorkspaceId, value])

  const hasAccess = value.selectedWorkspace?.user_has_access && value.selectedWorkspace?.permissions.includes('read')

  const defaultWorkspaceId =
    value.workspaces?.[0]?.id && value.workspaces[0].user_has_access && value.workspaces[0].permissions.includes('read')
      ? value.workspaces[0].id
      : undefined

  const isNotInsidePanel = location.pathname.startsWith('/auth') || location.pathname.startsWith('/subscription')

  return !isNotInsidePanel && (!currentWorkspaceId || !hashWorkspaceId) ? (
    <FullPageLoadingSuspenseFallback />
  ) : hasAccess || isNotInsidePanel ? (
    <WorkspaceInnerComp value={value}>{children}</WorkspaceInnerComp>
  ) : (
    <ErrorModal
      errorIcon={<NotAccessibleIcon color="error" />}
      title={<Trans>Oops! You do not have access to this workspace.</Trans>}
      description={<Trans>You don't have access to this workspace. Please log out or switch to your primary workspace.</Trans>}
      actions={
        <>
          <Stack justifySelf="start" mb={{ xs: 1, sm: 0 }} mr={{ xs: 1, sm: 0 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                if (defaultWorkspaceId) {
                  void value.selectWorkspace(defaultWorkspaceId)
                }
              }}
              disabled={!defaultWorkspaceId}
            >
              {defaultWorkspaceId ? <Trans>Switch to Primary Workspace</Trans> : <Trans>No Active Workspaces to Switch To</Trans>}
            </Button>
          </Stack>
          <Button
            onClick={() => void value.logout(true)}
            variant="outlined"
            color="warning"
            sx={{ mb: { xs: 1, sm: 0 }, mr: { xs: 1, sm: 0 } }}
          >
            <Trans>Log Out</Trans>
          </Button>
        </>
      }
    />
  )
}
