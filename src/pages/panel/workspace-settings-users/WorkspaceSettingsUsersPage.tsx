import { Stack } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundaryFallback, NetworkErrorBoundary } from 'src/shared/error-boundary-fallback'
import { LoadingSuspenseFallback } from 'src/shared/loading'
import { WorkspaceSettingsUserInvitationsTable } from './WorkspaceSettingsUserInvitationsTable'
import { WorkspaceSettingsUsersTable } from './WorkspaceSettingsUsersTable'

export default function WorkspaceSettingsUsersPage() {
  return (
    <Stack spacing={6}>
      <Stack flexGrow={1} flexShrink={1}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingSuspenseFallback />}>
            <WorkspaceSettingsUsersTable />
          </Suspense>
        </NetworkErrorBoundary>
      </Stack>
      <Stack flexGrow={1} flexShrink={1}>
        <NetworkErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingSuspenseFallback />}>
            <WorkspaceSettingsUserInvitationsTable />
          </Suspense>
        </NetworkErrorBoundary>
      </Stack>
    </Stack>
  )
}
