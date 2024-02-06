import { Trans } from '@lingui/macro'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useUserProfile } from 'src/core/auth'
import { useCopyString } from 'src/shared/utils/useCopyString'
import { WorkspaceSettingsFormItem } from './WorkspaceSettingsFormItem'
import { getWorkspaceSettingsQuery } from './getWorkspaceSettings.query'
import { patchWorkspaceSettingsMutation } from './patchWorkspaceSettings.mutation'

export const WorkspaceSettingsForm = () => {
  const { selectedWorkspace, refreshWorkspaces } = useUserProfile()
  const queryClient = useQueryClient()
  const copyString = useCopyString()
  const focusedRef = useRef<(focused: boolean) => void>()
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
    <>
      <WorkspaceSettingsFormItem
        label={<Trans>Workspace Name</Trans>}
        buttonName={<Trans>Rename</Trans>}
        isPending={isPending}
        isLoading={isLoading}
        onSubmit={(name) => workspaceSettingsMutation({ name, generate_new_external_id: false, workspaceId: selectedWorkspace?.id ?? '' })}
        value={data?.name ?? ''}
      />
      <WorkspaceSettingsFormItem
        label={<Trans>Workspace Id</Trans>}
        buttonName={<Trans>Copy</Trans>}
        isLoading={isLoading}
        onSubmit={(id) => void copyString(id)}
        readonly
        value={data?.id ?? ''}
      />
      <WorkspaceSettingsFormItem
        label={<Trans>External Id</Trans>}
        buttonName={<Trans>Regenerate</Trans>}
        isPending={isPending}
        isLoading={isLoading}
        onSubmit={() =>
          workspaceSettingsMutation(
            { name: data?.name ?? '', generate_new_external_id: true, workspaceId: selectedWorkspace?.id ?? '' },
            {
              onSuccess: (data) => {
                void copyString(data.external_id)
                focusedRef.current?.(true)
              },
            },
          )
        }
        focusedRef={focusedRef}
        readonly
        hide
        value={data?.external_id ?? ''}
      />
    </>
  )
}
