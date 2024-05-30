import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared/queries'

export const useHasAccountsCheck = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, true],
    queryFn: getWorkspaceCloudAccountsQuery,
  })

  const haveError = !data || typeof data === 'string'
  const paymentOnHold = haveError && data === 'workspace_payment_on_hold'
  const doesNotHaveAccount = haveError ? true : !data.added.length && !data.recent.length && !data.discovered.length

  return { haveError, doesNotHaveAccount, paymentOnHold }
}
