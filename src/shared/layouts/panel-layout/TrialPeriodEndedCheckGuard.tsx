import { PropsWithChildren } from 'react'
import { useUserProfile } from 'src/core/auth'
import { FullPageLoadingSuspenseFallback } from 'src/shared/loading'
import { MoveToFreeAcknowledge } from './MoveToFreeAcknowledge'

export const TrialPeriodEndedCheckGuard = ({ children }: PropsWithChildren) => {
  const { selectedWorkspace } = useUserProfile()

  if (selectedWorkspace?.id === undefined) {
    return <FullPageLoadingSuspenseFallback />
  }

  return selectedWorkspace.tier === 'Free' && !selectedWorkspace.move_to_free_acknowledged_at ? (
    <>
      <MoveToFreeAcknowledge key={selectedWorkspace.id} workspaceId={selectedWorkspace.id} />
      {children}
    </>
  ) : (
    children
  )
}
