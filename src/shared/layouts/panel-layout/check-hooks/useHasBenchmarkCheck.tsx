import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared/queries'

export const useHasBenchmarkCheck = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
    queryFn: getWorkspaceCloudAccountsQuery,
  })

  return typeof data === 'object' && !![...data.added, ...data.discovered, ...data.recent].find((i) => i.last_scan_finished_at)
}
