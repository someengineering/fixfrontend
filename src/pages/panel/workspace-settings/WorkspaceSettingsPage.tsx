import { Trans } from '@lingui/macro'
import FolderCopyIcon from '@mui/icons-material/FolderCopy'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { Button, Divider, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserProfile } from 'src/core/auth'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { useCopyString } from 'src/shared/utils/useCopyString'
import { WorkspaceSettingsForm } from './WorkspaceSettingsForm'
import { getWorkspaceSettingsQuery } from './getWorkspaceSettings.query'
import { patchWorkspaceSettingsMutation } from './patchWorkspaceSettings.mutation'

export default function WorkspaceSettingsPage() {
  const navigate = useAbsoluteNavigate()
  const { selectedWorkspace, refreshWorkspaces } = useUserProfile()
  const queryClient = useQueryClient()
  const copyString = useCopyString()
  const { mutate: workspaceSettingsMutation, isPending } = useMutation({
    mutationFn: patchWorkspaceSettingsMutation,
    onSuccess: (data) => {
      if (Object.keys(data).length) {
        queryClient.setQueryData(['workspace-settings', selectedWorkspace?.id ?? ''], () => data)
        queryClient.setQueryData(['workspace-external-id', selectedWorkspace?.id ?? ''], () => data.external_id)
      } else {
        void queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'workspace-settings' || query.queryKey[0] === 'workspace-external-id',
        })
      }
    },
    onSettled: () => {
      void refreshWorkspaces()
    },
  })
  const { data, isLoading } = useQuery({
    queryKey: ['workspace-settings', selectedWorkspace?.id ?? ''],
    queryFn: getWorkspaceSettingsQuery,
    enabled: !!selectedWorkspace,
  })

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h3">
        <Trans>Workspace Settings</Trans>
      </Typography>
      <WorkspaceSettingsForm
        label={<Trans>Workspace Name</Trans>}
        buttonName={<Trans>Rename</Trans>}
        pending={isPending}
        loading={isLoading}
        onSubmit={(name) => workspaceSettingsMutation({ name, generate_new_external_id: false, workspaceId: selectedWorkspace?.id ?? '' })}
        value={data?.name ?? ''}
      />
      <WorkspaceSettingsForm
        label={<Trans>Workspace Id</Trans>}
        buttonName={<Trans>Copy</Trans>}
        loading={isLoading}
        onSubmit={(id) => void copyString(id)}
        readonly
        value={data?.id ?? ''}
      />
      <WorkspaceSettingsForm
        label={<Trans>External Id</Trans>}
        buttonName={<Trans>Regenerate</Trans>}
        pending={isPending}
        loading={isLoading}
        onSubmit={() =>
          workspaceSettingsMutation({ name: data?.name ?? '', generate_new_external_id: true, workspaceId: selectedWorkspace?.id ?? '' })
        }
        readonly
        value={data?.external_id.replace(/[\da-zA-Z]/g, '*') ?? ''}
      />
      <Stack py={2}>
        <Divider />
      </Stack>
      <Typography variant="h3">
        <Trans>Other Workspace Settings</Trans>
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="start">
        <Button variant="outlined" onClick={() => navigate('workspace-settings/users')} startIcon={<PeopleIcon />}>
          <Trans>Users</Trans>
        </Button>
        <Button variant="outlined" onClick={() => navigate('workspace-settings/billing')} startIcon={<ReceiptIcon />}>
          <Trans>Billing & Invoices</Trans>
        </Button>
        <Button variant="outlined" onClick={() => navigate('workspace-settings/external-directories')} startIcon={<FolderCopyIcon />}>
          <Trans>External Directories</Trans>
        </Button>
      </Stack>
    </Stack>
  )
}
