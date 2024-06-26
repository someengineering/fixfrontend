import { t } from '@lingui/macro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { getWorkspaceCloudAccountsQuery } from 'src/pages/panel/shared/queries'
import { WorkspaceSettingsAccountsTableItem } from './WorkspaceSettingsAccountsTableItem'

export const WorkspaceSettingsAccountsTable = () => {
  const { selectedWorkspace } = useUserProfile()
  const { data } = useSuspenseQuery({
    queryKey: ['workspace-cloud-accounts', selectedWorkspace?.id, false],
    queryFn: getWorkspaceCloudAccountsQuery,
  })

  return (
    typeof data !== 'string' && (
      <>
        {data?.recent.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.recent}
            isTop
            isBottom={!data.discovered.length && !data.added.length}
            title={t`Recently added accounts`}
          />
        ) : null}
        {data?.added.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.added}
            isTop={!data.recent.length}
            isBottom={!data.discovered.length}
            title={t`Added accounts`}
          />
        ) : null}
        {data?.discovered.length ? (
          <WorkspaceSettingsAccountsTableItem
            data={data.discovered}
            isTop={!data.recent.length && !data.added.length}
            isBottom
            title={t`Discovered but unconfigured accounts`}
            isNotConfigured
          />
        ) : null}
      </>
    )
  )
}
