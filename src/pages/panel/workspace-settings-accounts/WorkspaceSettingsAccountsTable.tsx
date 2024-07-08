import { t } from '@lingui/macro'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery, getWorkspaceProductTiersQuery } from 'src/pages/panel/shared/queries'
import { GetWorkspaceProductTiersResponse } from 'src/shared/types/server'
import { WorkspaceSettingsAccountsTableItem } from './WorkspaceSettingsAccountsTableItem'

export const WorkspaceSettingsAccountsTable = () => {
  const { selectedWorkspace } = useUserProfile()
  const [{ data }, { data: currentTier }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, false],
        queryFn: getWorkspaceCloudAccountsQuery,
      },
      {
        queryFn: getWorkspaceProductTiersQuery,
        queryKey: ['workspace-product-tiers', selectedWorkspace?.id],
        select: (data: GetWorkspaceProductTiersResponse) => (selectedWorkspace?.tier ? data[selectedWorkspace.tier] : undefined),
      },
    ],
  })

  const accountLength = typeof data === 'object' ? data.added.length + data.discovered.length + data.recent.length : 0

  const canInviteBasedOnTier = (currentTier?.account_limit ?? Number.POSITIVE_INFINITY) > accountLength

  return (
    typeof data !== 'string' && (
      <>
        {data?.recent.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.recent}
            isTop
            isBottom={!data.discovered.length && !data.added.length}
            title={t`Recently added accounts`}
            canInviteBasedOnTier={canInviteBasedOnTier}
          />
        ) : null}
        {data?.added.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.added}
            isTop={!data.recent.length}
            isBottom={!data.discovered.length}
            title={t`Added accounts`}
            canInviteBasedOnTier={canInviteBasedOnTier}
          />
        ) : null}
        {data?.discovered.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.discovered}
            isTop={!data.recent.length && !data.added.length}
            isBottom
            title={t`Discovered but unconfigured accounts`}
            canInviteBasedOnTier={canInviteBasedOnTier}
            isNotConfigured
          />
        ) : null}
      </>
    )
  )
}
