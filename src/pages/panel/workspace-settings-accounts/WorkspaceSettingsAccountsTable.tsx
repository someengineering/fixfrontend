import { plural, t, Trans } from '@lingui/macro'
import { Alert, Typography } from '@mui/material'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery, getWorkspaceProductTiersQuery } from 'src/pages/panel/shared/queries'
import { InternalLink } from 'src/shared/link-button'
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

  const accountLength =
    typeof data === 'object'
      ? [
          ...new Set(
            [...data.added, ...data.discovered, ...data.recent].filter((acc) => acc.enabled && acc.is_configured).map((acc) => acc.id),
          ),
        ].length
      : 0
  const accountLimit = currentTier?.account_limit ?? Number.POSITIVE_INFINITY

  const canInviteBasedOnTier = accountLimit > accountLength

  const enableErrorModalContent = canInviteBasedOnTier ? null : (
    <Alert color="warning">
      <Typography>
        <Trans>
          You currently have{' '}
          {plural(accountLength, {
            one: '# enabled cloud account',
            other: '# enabled cloud accounts',
          })}
          . There must only be{' '}
          {plural(accountLimit ?? 1, {
            one: '# cloud account',
            other: '# cloud accounts',
          })}{' '}
          enabled in {selectedWorkspace?.tier} tier. To increase your cloud account limit, you can upgrade your product tier{' '}
          <InternalLink to="/workspace-settings/billing-receipts">here</InternalLink>.
        </Trans>
      </Typography>
    </Alert>
  )

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
            enableErrorModalContent={enableErrorModalContent}
          />
        ) : null}
        {data?.added.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.added}
            isTop={!data.recent.length}
            isBottom={!data.discovered.length}
            title={t`Added accounts`}
            canInviteBasedOnTier={canInviteBasedOnTier}
            enableErrorModalContent={enableErrorModalContent}
          />
        ) : null}
        {data?.discovered.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.discovered}
            isTop={!data.recent.length && !data.added.length}
            isBottom
            title={t`Discovered but unconfigured accounts`}
            canInviteBasedOnTier={canInviteBasedOnTier}
            enableErrorModalContent={enableErrorModalContent}
            isNotConfigured
          />
        ) : null}
      </>
    )
  )
}
